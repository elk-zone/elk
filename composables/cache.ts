import LRU from 'lru-cache'
import type { mastodon } from 'masto'

const cache = new LRU<string, any>({
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
  const promise = useMasto().v1.statuses.fetch(id)
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
  const domain = currentInstance.value?.uri
  const promise = useMasto().v1.accounts.fetch(id)
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
  const key = `${server}:${userId}:account:${acct}`
  const cached = cache.get(key)
  if (cached)
    return cached
  const domain = currentInstance.value?.uri
  const account = useMasto().v1.accounts.lookup({ acct })
    .then((r) => {
      if (r.acct && !r.acct.includes('@') && domain)
        r.acct = `${r.acct}@${domain}`

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
  setCached(`${server}:${userId}:account:${account.id}`, account, override)
  setCached(`${server}:${userId}:account:${account.acct}`, account, override)
}
