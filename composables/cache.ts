import LRU from 'lru-cache'
import type { Account, Status } from 'masto'

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

export function fetchStatus(id: string, force = false): Promise<Status> {
  const server = currentServer.value
  const key = `${server}:status:${id}`
  const cached = cache.get(key)
  if (cached && !force)
    return cached
  const promise = useMasto().statuses.fetch(id)
    .then((status) => {
      cacheStatus(status)
      return status
    })
  cache.set(key, promise)
  return promise
}

export function fetchAccountById(id?: string | null): Promise<Account | null> {
  if (!id)
    return Promise.resolve(null)

  const server = currentServer.value
  const key = `${server}:account:${id}`
  const cached = cache.get(key)
  if (cached)
    return cached
  const uri = currentInstance.value?.uri
  const promise = useMasto().accounts.fetch(id)
    .then((r) => {
      if (!r.acct.includes('@') && uri)
        r.acct = `${r.acct}@${uri}`

      cacheAccount(r, server, true)
      return r
    })
  cache.set(key, promise)
  return promise
}

export async function fetchAccountByHandle(acct: string): Promise<Account> {
  const server = currentServer.value
  const key = `${server}:account:${acct}`
  const cached = cache.get(key)
  if (cached)
    return cached
  const uri = currentInstance.value?.uri
  const account = useMasto().accounts.lookup({ acct })
    .then((r) => {
      if (!r.acct.includes('@') && uri)
        r.acct = `${r.acct}@${uri}`

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

export function cacheStatus(status: Status, server = currentServer.value, override?: boolean) {
  setCached(`${server}:status:${status.id}`, status, override)
}

export function cacheAccount(account: Account, server = currentServer.value, override?: boolean) {
  setCached(`${server}:account:${account.id}`, account, override)
  setCached(`${server}:account:${account.acct}`, account, override)
}
