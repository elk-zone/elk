import { LRUCache } from 'lru-cache'
import type { mastodon } from 'masto'

// expire in an hour
const cache = new LRUCache<string, any>({
  max: 1000,
  ttl: 3600000,
  ttlAutopurge: true,
  allowStaleOnFetchAbort: true,
  allowStaleOnFetchRejection: true,
  allowStale: true,
  noUpdateTTL: true,
  ttlResolution: 60000,
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

function generateStatusIdCacheKeyAccessibleToCurrentUser(statusId: string) {
  return `${currentServer.value}:${currentUser.value?.account.id}:status:${statusId}`
}

async function federateRemoteStatus(statusUri: string, force = false): Promise<mastodon.v1.Status | null> {
  if (cache.has(`stop:${statusUri}`)) {
    if (process.dev)
      // eslint-disable-next-line no-console
      console.debug(`Skipping further processing for invalid status URI: ${statusUri}`)
    return Promise.resolve(null)
  }

  if (statusUri.startsWith(`https://${currentServer.value}`)) {
    if (process.dev)
      // eslint-disable-next-line no-console
      console.info(`Local domain is authoritative, so redirecting resolution request for status: ${statusUri}`)

    return fetchStatus(statusUri.split('/').pop() ?? statusUri.replace(`https://${currentServer.value}/`, ''))
  }

  if (statusUri.search(/^\d+$/) !== -1) {
    if (process.dev)
      // eslint-disable-next-line no-console
      console.info(`statusUri parameter was passed an ID, so redirecting resolution request: ${statusUri}`)

    return fetchStatus(statusUri, force)
  }

  const localStatusIdCacheKey = generateStatusIdCacheKeyAccessibleToCurrentUser(statusUri)

  const cached: mastodon.v1.Status | Promise<mastodon.v1.Status> | undefined | null | number = cache.get(localStatusIdCacheKey, { allowStale: false, updateAgeOnGet: false })
  if (cached) {
    if (
      !!cached
      && !(typeof cached === 'number')
      && !(cached instanceof Promise)
      && (cached.uri === statusUri)
      && !force
    ) {
      return cached
    }
    else if (cached instanceof Promise) {
      return cached
    }
    else if (typeof cached === 'number') {
      if ([401, 403, 418].includes(cached))
        console.error(`Current user is forbidden or lacks authorization to fetch status: ${statusUri}`)
      if ([404].includes(cached))
        console.error(`The requested status URI cannot be found: ${statusUri}`)
      if ([429].includes(cached))
        console.error('The request was rate-limited by the Mastodon server')
      if ([500, 501, 503].includes(cached))
        console.error('The Mastodon server is unresponsive')
      return Promise.resolve(null)
    }
  }

  const promise = useMastoClient().v2.search({ q: statusUri, type: 'statuses', resolve: (!!currentUser.value), limit: 1 })
    .then(async (results) => {
      const post = results.statuses.pop()
      if (!post) {
        console.error(`Status could not be federated, perhaps it no longer exists: '${statusUri}'`)
        cache.set(localStatusIdCacheKey, 404)
        return Promise.resolve(null)
      }

      const splitUri = post.account.url.replace('https://', '').split('/@')
      const accountWebfinger = `${splitUri[1]}@${splitUri[0]}`
      post.account.acct = accountWebfinger

      cache.set(localStatusIdCacheKey, post)
      return post
    })
    .catch((e) => {
      console.error(`Encountered error while federating status using URI '${statusUri}' | ${(e as Error)}`)
      cache.set(localStatusIdCacheKey, null)
      return Promise.resolve(null)
    })
  cache.set(localStatusIdCacheKey, promise)
  return promise
}

export async function fetchStatus(statusId: string, force = false): Promise<mastodon.v1.Status | null> {
  if (cache.has(`stop:${statusId}`)) {
    if (process.dev)
      // eslint-disable-next-line no-console
      console.debug(`Skipping further processing for invalid status Id: ${statusId}`)
    return Promise.resolve(null)
  }

  // Handle scenario where the value of statusId is actually an URI
  if (statusId.startsWith('h')) {
    if (process.dev)
      // eslint-disable-next-line no-console
      console.info(`statusId parameter was passed an URI, so redirecting resolution request: ${statusId}`)
    return federateRemoteStatus(statusId, force)
  }

  // handle invalid statusId
  if ((statusId.search(/^\d+$/) === -1)) {
    console.error(`Malformed or unrecognized Status ID: ${statusId}`)
    cache.set(`stop:${statusId}`, 418)
    return Promise.resolve(null)
  }

  const localStatusIdCacheKey = generateStatusIdCacheKeyAccessibleToCurrentUser(statusId)
  const cached: mastodon.v1.Status | Promise<mastodon.v1.Status> | undefined | null = cache.get(localStatusIdCacheKey, { allowStale: false, updateAgeOnGet: false })
  if (cached) {
    // avoid race condition by returning the existing promise instead of restarting the chain of events all over again
    if (cached instanceof Promise)
      return cached
    if (typeof cached === 'number') {
      // wait for the cached value to expire before trying again
      if ([401, 403, 404, 418, 429, 500, 501, 503].includes(cached))
        return null
    }
    else if (cached.id === statusId) {
      // if we don't care about authoritative values then return cached value
      if (!force)
        return cached
    }
  }

  const promise = useMastoClient().v1.statuses.fetch(statusId)
    .then(async (post) => {
      const splitUri = post.account.url.replace('https://', '').split('/@')
      const accountWebfinger = `${splitUri[1]}@${splitUri[0]}`
      post.account.acct = accountWebfinger
      cache.set(localStatusIdCacheKey, post)
      return post
    })
  cache.set(localStatusIdCacheKey, promise)
  return promise
}

export function fetchAccountById(id?: string | null): Promise<mastodon.v1.Account | null> {
  if (!id)
    return Promise.resolve(null)

  const server = currentServer.value
  const userId = currentUser.value?.account.id
  const key = `${server}:${userId}:account:${id}`
  const cached = cache.get(key)
  if (cached)
    return cached
  const domain = getInstanceDomainFromServer(server)
  const promise = useMastoClient().v1.accounts.fetch(id)
    .then((r) => {
      if (r.acct && !r.acct.includes('@') && domain)
        r.acct = `${r.acct}@${domain}`

      cacheAccount(r, server, true)
      return r
    })
  cache.set(key, promise)
  return promise
}

export async function fetchAccountByHandle(acct: string): Promise<mastodon.v1.Account> {
  const server = currentServer.value
  const userId = currentUser.value?.account.id
  const domain = getInstanceDomainFromServer(server)
  const userAcct = (domain && acct.endsWith(`@${domain}`)) ? acct.slice(0, -domain.length - 1) : acct
  const key = `${server}:${userId}:account:${userAcct}`
  const cached = cache.get(key)
  if (cached)
    return cached

  async function lookupAccount() {
    const client = useMastoClient()
    let account: mastodon.v1.Account
    if (!isGotoSocial.value)
      account = await client.v1.accounts.lookup({ acct: userAcct })
    else
      account = (await client.v1.search({ q: `@${userAcct}`, type: 'accounts' })).accounts[0]

    if (account.acct && !account.acct.includes('@') && domain)
      account.acct = `${account.acct}@${domain}`
    return account
  }

  const account = lookupAccount()
    .then((r) => {
      cacheAccount(r, server, true)
      return r
    })
  cache.set(key, account)
  return account
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

export function cacheAccount(account: mastodon.v1.Account, server = currentServer.value, override?: boolean) {
  const userId = currentUser.value?.account.id
  const userAcct = account.acct.endsWith(`@${server}`) ? account.acct.slice(0, -server.length - 1) : account.acct
  setCached(`${server}:${userId}:account:${account.id}`, account, override)
  setCached(`${server}:${userId}:account:${userAcct}`, account, override)
}
