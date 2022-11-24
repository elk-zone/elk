import LRU from 'lru-cache'
import type { Account, Status } from 'masto'

const cache = new LRU<string, any>({
  max: 1000,
})

if (process.dev)
  // eslint-disable-next-line no-console
  console.log({ cache })

export function setCached(key: string, value: any) {
  cache.set(key, value)
}

export function fetchStatus(id: string) {
  const key = `status:${id}`
  const cached = cache.get(key)
  if (cached)
    return cached
  const promise = masto.statuses.fetch(id)
    .then((status) => {
      cacheStatus(status)
      return status
    })
  cache.set(key, promise)
  return promise
}

export function fetchAccount(id: string) {
  const key = `account:${id}`
  const cached = cache.get(key)
  if (cached)
    return cached
  const promise = masto.accounts.fetch(id)
    .then((account) => {
      cacheAccount(account)
      return account
    })
  cache.set(key, promise)
  return promise
}

export function fetchAccountByName(acct: string) {
  const key = `account:${acct}`
  const cached = cache.get(key)
  if (cached)
    return cached
  const account = masto.accounts.fetch(acct)
    .then((r) => {
      cacheAccount(r)
      return r
    })
  cache.set(key, account)
  return account
}

export function cacheStatus(status: Status) {
  setCached(`status:${status.id}`, status)
}

export function cacheAccount(account: Account) {
  setCached(`account:${account.id}`, account)
  setCached(`account:${account.acct}`, account)
}
