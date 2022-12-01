import LRU from 'lru-cache'
import type { Account, Status } from 'masto'

const cache = new LRU<string, any>({
  max: 1000,
})

if (process.dev)
  // eslint-disable-next-line no-console
  console.log({ cache })

export function setCached(key: string, value: any, override = false) {
  if (override || !cache.has(key))
    cache.set(key, value)
}

export function fetchStatus(id: string, force = false): Promise<Status> {
  const key = `status:${id}`
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

export function fetchAccountById(id: string): Promise<Account> {
  const key = `account:${id}`
  const cached = cache.get(key)
  if (cached)
    return cached
  const promise = useMasto().accounts.fetch(id)
    .then((account) => {
      cacheAccount(account, true)
      return account
    })
  cache.set(key, promise)
  return promise
}

export async function fetchAccountByHandle(acct: string): Promise<Account> {
  const key = `account:${acct}`
  const cached = cache.get(key)
  if (cached)
    return cached
  const account = useMasto().accounts.lookup({ acct })
    .then((r) => {
      cacheAccount(r, true)
      return r
    })
  cache.set(key, account)
  return account
}

export function useAccountByHandle(acct: string) {
  return useAsyncState(() => fetchAccountByHandle(acct), null).state
}

export function useAccountById(id: string) {
  return useAsyncState(() => fetchAccountById(id), null).state
}

export function cacheStatus(status: Status, override?: boolean) {
  setCached(`status:${status.id}`, status, override)
}

export function cacheAccount(account: Account, override?: boolean) {
  setCached(`account:${account.id}`, account, override)
  setCached(`account:${account.acct}`, account, override)
}
