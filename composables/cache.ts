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
    if (!isGotoSocial.value) { // TODO: GoToSocial will support this endpoint from 0.10.0
      account = await client.v1.accounts.lookup({ acct: userAcct })
    }
    else {
      const userAcctDomain = userAcct.includes('@') ? userAcct : `${userAcct}@${domain}`
      account = (await client.v1.search({ q: `@${userAcctDomain}`, type: 'accounts' })).accounts[0]
    }

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
