import type { akkoma } from '@bdxtown/akko'
import { LRUCache } from 'lru-cache'
import { name } from './../package.json'

const cache = new LRUCache<string, any>({
  max: 1000,
})

if (import.meta.dev && import.meta.client)
  // eslint-disable-next-line no-console
  console.log({ cache })

export function setCached(key: string, value: any, override = false) {
  if (override || !cache.has(key))
    cache.set(key, value)
}
function removeCached(key: string) {
  cache.delete(key)
}

export function fetchFrontendConfiguration(): Promise<FrontendConfiguration | undefined> {
  const server = currentServer.value
  const key = `${server}:pleroma-config`
  const cached = cache.has(key)
  if (cached)
    return Promise.resolve(cache.get(key))

  const promise = useAkkoClient().pleroma.frontendConfigurations.fetch().then((config) => {
    const frontendConfiguration = config[`${name.replace(/[-@/]/g, '')}Fe`]
    cacheFrontendConfiguration(frontendConfiguration)
    return frontendConfiguration as unknown as FrontendConfiguration | undefined
  })
  cache.set(key, promise)
  return promise
}

export function fetchStatus(id: string, force = false): Promise<akkoma.v1.Status> {
  const server = currentServer.value
  const userId = currentUser.value?.account.id
  const key = `${server}:${userId}:status:${id}`
  const cached = cache.get(key)
  if (cached && !force)
    return Promise.resolve(cached)

  const promise = useAkkoClient().v1.statuses.$select(id).fetch().then((status) => {
    cacheStatus(status)
    return status
  })
  cache.set(key, promise)
  return promise
}

export function fetchAccountById(id?: string | null): Promise<akkoma.v1.Account | null> {
  if (!id)
    return Promise.resolve(null)

  const server = currentServer.value
  const userId = currentUser.value?.account.id
  const key = `${server}:${userId}:account:${id}`
  const cached = cache.get(key)
  if (cached)
    return Promise.resolve(cached)

  const domain = getInstanceDomainFromServer(server)
  const promise = useAkkoClient().v1.accounts.$select(id).fetch().then((r) => {
    if (r.acct && !r.acct.includes('@') && domain)
      r.acct = `${r.acct}@${domain}`

    cacheAccount(r, server, true)
    return r
  })
  cache.set(key, promise)
  return promise
}

export async function fetchAccountByHandle(acct: string): Promise<akkoma.v1.Account> {
  const server = currentServer.value
  const userId = currentUser.value?.account.id
  const domain = getInstanceDomainFromServer(server)
  const userAcct = (domain && acct.endsWith(`@${domain}`)) ? acct.slice(0, -domain.length - 1) : acct
  const key = `${server}:${userId}:account:${userAcct}`
  const cached = cache.get(key)
  if (cached)
    return Promise.resolve(cached)

  async function lookupAccount() {
    const client = useAkkoClient()
    let account: akkoma.v1.Account
    if (!isGotoSocial.value) { // TODO: GoToSocial will support this endpoint from 0.10.0
      account = await client.v1.accounts.lookup({ acct: userAcct })
    }
    else {
      const userAcctDomain = userAcct.includes('@') ? userAcct : `${userAcct}@${domain}`
      account = (await client.v1.search.fetch({ q: `@${userAcctDomain}`, type: 'accounts' })).accounts[0]
    }

    if (account.acct && !account.acct.includes('@') && domain)
      account.acct = `${account.acct}@${domain}`
    return account
  }

  const promise = lookupAccount()
    .then((r) => {
      cacheAccount(r, server, true)
      return r
    })
  cache.set(key, promise)
  return promise
}

export function fetchTag(tagName: string, force = false): Promise<akkoma.v1.Tag> {
  const server = currentServer.value
  const userId = currentUser.value?.account.id
  const key = `${server}:${userId}:tag:${tagName}`
  const cached = cache.get(key)
  if (cached && !force)
    return Promise.resolve(cached)

  const promise = useAkkoClient().v1.tags.$select(tagName).fetch().then((tag) => {
    cacheTag(tag)
    return tag
  })
  cache.set(key, promise)
  return promise
}

export function useAccountById(id?: string | null) {
  return useAsyncState(() => fetchAccountById(id), null).state
}

export function cacheFrontendConfiguration(config: unknown | undefined, override?: boolean) {
  const server = currentServer.value
  setCached(`${server}:pleroma-config`, config, override)
}

export function cacheStatus(status: akkoma.v1.Status, server = currentServer.value, override?: boolean) {
  const userId = currentUser.value?.account.id
  setCached(`${server}:${userId}:status:${status.id}`, status, override)
}

export function removeCachedStatus(id: string, server = currentServer.value) {
  const userId = currentUser.value?.account.id
  removeCached(`${server}:${userId}:status:${id}`)
}

export function cacheAccount(account: akkoma.v1.Account, server = currentServer.value, override?: boolean) {
  const userId = currentUser.value?.account.id
  const userAcct = account.acct.endsWith(`@${server}`) ? account.acct.slice(0, -server.length - 1) : account.acct
  setCached(`${server}:${userId}:account:${account.id}`, account, override)
  setCached(`${server}:${userId}:account:${userAcct}`, account, override)
}

export function cacheTag(tag: akkoma.v1.Tag, server = currentServer.value, override?: boolean) {
  const userId = currentUser.value?.account.id
  setCached(`${server}:${userId}:tag:${tag.name}`, tag, override)
}
