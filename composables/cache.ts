import { LRUCache } from 'lru-cache'
import type { mastodon } from 'masto'

const cache = new LRUCache<string, any>({
  max: 1000,
})

if (process.dev && process.client)
  // eslint-disable-next-line no-console
  console.log({ cache })

export function setCached(key: string, value: any, override = false) {
  if (override || !cache.has(key))
    cache.set(key, value)
}
function removeCached(key: string) {
  cache.delete(key)
}

export function extractAccountWebfinger(webfingerOrUriOrUrl: string) {
  if (webfingerOrUriOrUrl.includes('/tags/'))
    return null

  const preNormalized = webfingerOrUriOrUrl.replace('https://', '').replace(`/${currentServer.value}/@`, '')
  if (preNormalized.replace(/^@+/i, '').search(/^[\w]+@[a-z0-9][\w\.]+\.[a-z]+$/ig) === 0)
    return preNormalized.replace(/^@+/i, '')

  const normalizedValue = preNormalized.replace('https://', '')
    .replace('/users/', '/@')
    .replace('/u/', '/@')
    .replace('@@', '@')
    .replace(/^@+/i, '')
    .replace(/\/statuses\/[0-9a-z\/]+$/ig, '')

  if (normalizedValue.includes('/@')) {
    const splitValue = normalizedValue.split('/@')
    return `${splitValue[1]}@${splitValue[0]}`
  }
  else if (
    !normalizedValue.includes('/')
    && !normalizedValue.startsWith('@')
    && normalizedValue.includes('@')
    && normalizedValue.indexOf('@') === normalizedValue.lastIndexOf('@')
  ) {
    return normalizedValue
  }
  else if (normalizedValue.search(/^[a-z0-9_]{1,30}$/i) === 0) {
    // see https://github.com/mastodon/mastodon/blob/25c66fa640962a4d54d59a3f53516ab6dcb1dae6/app/models/concerns/omniauthable.rb#L95
    return normalizedValue
  }
  else {
    if (process.dev)
      console.warn(`Malformed account URI or URL: ${webfingerOrUriOrUrl}`)
    return null
  }
}

function generateAccountWebfingerCacheKeyAccessibleToCurrentUser(webfingerOrUriOrUrl: string) {
  const normalizedValue = extractAccountWebfinger(webfingerOrUriOrUrl)
  if (!normalizedValue)
    return null
  return `${currentServer.value}:${currentUser.value?.account.id}:account:${normalizedValue}`
}

function generateAccountIdCacheKey(accountId: string) {
  return `${currentServer.value}:${currentUser.value?.account.id}:account:${accountId}`
}

export function fetchStatus(id: string, force = false): Promise<mastodon.v1.Status> {
  const server = currentServer.value
  const userId = currentUser.value?.account.id
  const key = `${server}:${userId}:status:${id}`
  const cached = cache.get(key)
  if (cached && !force)
    return cached
  const promise = useMastoClient().v1.statuses.fetch(id)
    .then((status) => {
      cacheStatus(status)
      return status
    })
  cache.set(key, promise)
  return promise
}

async function federateRemoteAccount(webfingerOrUriOrUrl: string, force = false): Promise<mastodon.v1.Account | null> {
  const accountWebfinger = extractAccountWebfinger(webfingerOrUriOrUrl)
  if (!accountWebfinger)
    return Promise.resolve(null)

  if (accountWebfinger.includes(currentServer.value)) {
    if (process.dev)
      // eslint-disable-next-line no-console
      console.info(`Local domain is authoritative, so redirecting resolution request for account: ${accountWebfinger}`)

    return fetchAccountByHandle(accountWebfinger, force)
  }

  const cacheKeyAuthoritativeAccount = generateAccountWebfingerCacheKeyAccessibleToCurrentUser(accountWebfinger)!

  const cachedAuthoritative: mastodon.v1.Account | Promise<mastodon.v1.Account> | undefined | null | number = cache.get(cacheKeyAuthoritativeAccount, { allowStale: false, updateAgeOnGet: false })

  if (cachedAuthoritative) {
    if (
      !!cachedAuthoritative
      && !(typeof cachedAuthoritative === 'number')
      && !(cachedAuthoritative instanceof Promise)
      && (cachedAuthoritative.acct === accountWebfinger)
      && !force
    ) {
      return cachedAuthoritative
    }
    else if (cachedAuthoritative instanceof Promise) {
      return cachedAuthoritative
    }
    else if (typeof cachedAuthoritative === 'number') {
      if ([401, 403, 418].includes(cachedAuthoritative))
        console.error(`Current user is forbidden or lacks authorization to fetch account: ${webfingerOrUriOrUrl}`)
      if ([404].includes(cachedAuthoritative))
        console.error(`The requested account Webfinger address cannot be found: ${webfingerOrUriOrUrl}`)
      if ([429].includes(cachedAuthoritative))
        console.error('The request was rate-limited by the Mastodon server')
      if ([500, 501, 503].includes(cachedAuthoritative))
        console.error('The Mastodon server is unresponsive')
      return Promise.resolve(null)
    }
  }

  const promise = useMastoClient().v2.search({ q: accountWebfinger, type: 'accounts', resolve: (!!currentUser.value), limit: 1 })
    .then((results) => {
      const account = results.accounts.pop()
      if (!account) {
        console.error(`Account could not be federated, perhaps it no longer exists: '${accountWebfinger}'`)
        cache.set(cacheKeyAuthoritativeAccount, 404)
        return Promise.resolve(null)
      }

      account.acct = accountWebfinger
      // Intentionally overriding cached value because this should be the most recent
      cache.set(cacheKeyAuthoritativeAccount, account)
      return account
    })
    .catch((e) => {
      console.error(`Encountered error while federating account using Webfinger address '${accountWebfinger}' | ${(e as Error).message}`)
      cache.set(cacheKeyAuthoritativeAccount, null)
      return Promise.resolve(null)
    })
  cache.set(cacheKeyAuthoritativeAccount, promise)
  return promise
}

function fetchAccountById(accountId?: string | null, force = false): Promise<mastodon.v1.Account | null> {
  if (!accountId || accountId.trim() === '')
    return Promise.resolve(null)

  const cacheKeyAccountId = generateAccountIdCacheKey(accountId)
  const cachedAccountLocallyAccessibleToCurrentUser: mastodon.v1.Account | Promise<mastodon.v1.Account> | undefined | null | number = cache.get(cacheKeyAccountId)
  if (cachedAccountLocallyAccessibleToCurrentUser) {
    // avoid race condition by returning the existing promise instead of restarting the chain of events all over again
    if (cachedAccountLocallyAccessibleToCurrentUser instanceof Promise)
      return cachedAccountLocallyAccessibleToCurrentUser
    if (typeof cachedAccountLocallyAccessibleToCurrentUser === 'number') {
      // wait for the cached value to expire before trying again
      if ([401, 403, 418].includes(cachedAccountLocallyAccessibleToCurrentUser))
        console.error(`Current user is forbidden or lacks authorization to fetch account id: ${accountId}`)
      if ([404].includes(cachedAccountLocallyAccessibleToCurrentUser))
        console.error(`The requested account id cannot be found: ${accountId}`)
      if ([429].includes(cachedAccountLocallyAccessibleToCurrentUser))
        console.error(`Rate-limiting interrupted request for account id: ${accountId}`)
      if ([500, 501, 503].includes(cachedAccountLocallyAccessibleToCurrentUser))
        console.error(`Unresponsive Mastodon server encountered while fetching account id: ${accountId}`)
      return Promise.resolve(null)
    }
    if (
      (cachedAccountLocallyAccessibleToCurrentUser.id === accountId)
      && !force
      && cachedAccountLocallyAccessibleToCurrentUser.url.includes(currentServer.value)
    ) {
      // if we already cached the authoritative value, then return that
      return Promise.resolve(cachedAccountLocallyAccessibleToCurrentUser)
    }
  }

  const promise = useMastoClient().v1.accounts.fetch(accountId)
    .then((account) => {
      const accountWebfinger = extractAccountWebfinger(account.url)
      if (!accountWebfinger) {
        console.error(`Malformed or invalid account Webfinger address: ${account.url}`)
        return null
      }
      account.acct = accountWebfinger
      cache.set(cacheKeyAccountId, account)
      return account
    })
    .catch((e) => {
      console.error(`Encountered error while fetching account Id '${accountId}' | ${(e as Error).message}`)
      cache.set(cacheKeyAccountId, 404)
      return Promise.resolve(null)
    })
  cache.set(cacheKeyAccountId, promise)
  return promise
}

export async function fetchAccountByHandle(str: string, force = false): Promise<mastodon.v1.Account | null> {
  const accountWebfinger = extractAccountWebfinger(str)
  if (!accountWebfinger) {
    console.error(`Malformed or invalid account handle: ${str}`)
    return Promise.resolve(null)
  }
  const cacheKeyWebfingerAccount = generateAccountWebfingerCacheKeyAccessibleToCurrentUser(accountWebfinger)!
  const cachedAccountLocallyAccessibleToCurrentUser: mastodon.v1.Account | Promise<mastodon.v1.Account> | undefined | null | number = cache.get(cacheKeyWebfingerAccount, { allowStale: false, updateAgeOnGet: false })

  if (cachedAccountLocallyAccessibleToCurrentUser) {
    if (
      !!cachedAccountLocallyAccessibleToCurrentUser
      && !(typeof cachedAccountLocallyAccessibleToCurrentUser === 'number')
      && !(cachedAccountLocallyAccessibleToCurrentUser instanceof Promise)
      && (cachedAccountLocallyAccessibleToCurrentUser.acct === accountWebfinger)
    ) {
      // if the cached version is authoritative, then return it
      if (!force && (cachedAccountLocallyAccessibleToCurrentUser.url.includes(currentServer.value)))
        return cachedAccountLocallyAccessibleToCurrentUser
    }
    else if (cachedAccountLocallyAccessibleToCurrentUser instanceof Promise) {
      return cachedAccountLocallyAccessibleToCurrentUser
    }
    else if (typeof cachedAccountLocallyAccessibleToCurrentUser === 'number') {
      if ([401, 403, 418].includes(cachedAccountLocallyAccessibleToCurrentUser))
        console.error(`Current user is forbidden or lacks authorization to fetch account: ${accountWebfinger}`)
      if ([404].includes(cachedAccountLocallyAccessibleToCurrentUser))
        console.error(`The requested account Webfinger address cannot be found: ${accountWebfinger}`)
      if ([429].includes(cachedAccountLocallyAccessibleToCurrentUser))
        console.error('The request was rate-limited by the Mastodon server')
      if ([500, 501, 503].includes(cachedAccountLocallyAccessibleToCurrentUser))
        console.error('The Mastodon server is unresponsive')
      return Promise.resolve(null)
    }
  }

  const promise = useMastoClient().v1.accounts.lookup({ acct: parseAcctFromPerspectiveOfCurrentServer(str) ?? str })
    .then((account) => {
      account.acct = accountWebfinger

      cache.set(cacheKeyWebfingerAccount, account)
      const cacheKeyAccountId = generateAccountIdCacheKey(account.id)
      cache.set(cacheKeyAccountId, account)

      return account
    })
    .catch((e) => {
      if (!accountWebfinger.includes(currentServer.value)) {
        if (process.dev)
          // eslint-disable-next-line no-console
          console.info(`Remote domain is authoritative, so redirecting resolution request for account: ${accountWebfinger}`)

        return federateRemoteAccount(accountWebfinger)
      }
      if (process.dev)
        console.error(`Encountered error while fetching account: '${accountWebfinger}' | ${(e as Error).message}`)
      cache.set(cacheKeyWebfingerAccount, 404)
      return Promise.resolve(null)
    })
  cache.set(cacheKeyWebfingerAccount, promise)
  return promise
}

export function useAccountByHandle(acct: string) {
  return useAsyncState(() => fetchAccountByHandle(acct), null).state
}

export function useAccountById(id?: string | null) {
  return useAsyncState(() => fetchAccountById(id), null).state
}

export function cacheStatus(status: mastodon.v1.Status, server = currentServer.value, override?: boolean) {
  const userId = currentUser.value?.account.id
  setCached(`${server}:${userId}:status:${status.id}`, status, override)
}

export function removeCachedStatus(id: string, server = currentServer.value) {
  const userId = currentUser.value?.account.id
  removeCached(`${server}:${userId}:status:${id}`)
}

export function cacheAccount(account: mastodon.v1.Account, override?: boolean) {
  setCached(generateAccountIdCacheKey(account.id)!, account, override)
  setCached(generateAccountWebfingerCacheKeyAccessibleToCurrentUser(account.url)!, account, override)
}
