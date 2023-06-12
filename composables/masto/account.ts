import type { mastodon } from 'masto'

export function getDisplayName(account: mastodon.v1.Account, options?: { rich?: boolean }) {
  const displayName = account.displayName || account.username || account.acct || ''
  if (options?.rich)
    return displayName
  return displayName.replace(/:([\w-]+?):/g, '')
}

export function accountToShortHandle(acct: string) {
  return `@${acct.includes('@') ? acct.split('@')[0] : acct}`
}

export function getShortHandle({ acct }: mastodon.v1.Account) {
  if (!acct)
    return ''
  return accountToShortHandle(acct)
}

export function getServerName(account: mastodon.v1.Account) {
  return account.url.replace('https://', '').split('/')[0]
}

export function getFullHandle(account: mastodon.v1.Account) {
  const handle = `@${account.acct}`
  if (!currentUser.value || account.acct.includes('@'))
    return handle
  return `${handle}@${getServerName(account)}`
}

export function toShortHandle(fullHandle: string) {
  if (!currentUser.value)
    return fullHandle
  const server = currentUser.value.server
  if (fullHandle.endsWith(`@${server}`))
    return fullHandle.slice(0, -server.length - 1)
  return fullHandle
}

export function rawAcctToResolvedAccount(acct: string) {
  return fetchAccountByHandle(`@${acct}`)
}

export function getAcctFromPerspectiveOfCurrentServer(account: mastodon.v1.Account) {
  return `${account.username}@${getServerName(account)}`.replace(`@${currentServer.value}`, '')
}

export function parseAcctFromPerspectiveOfCurrentServer(webfingerOrUriOrUrl: string) {
  // see https://github.com/mastodon/mastodon/blob/25c66fa640962a4d54d59a3f53516ab6dcb1dae6/app/models/concerns/omniauthable.rb#L95
  if (webfingerOrUriOrUrl.search(/^@[a-z0-9_]{1,30}$/i) === 0)
    return webfingerOrUriOrUrl

  return extractAccountWebfinger(webfingerOrUriOrUrl)?.replace(`@${currentServer.value}`, '') ?? undefined
}

export function extractAccountHandle(account: mastodon.v1.Account) {
  let handle = getFullHandle(account).slice(1)
  const uri = currentInstance.value ? getInstanceDomain(currentInstance.value) : currentServer.value
  if (currentInstance.value && handle.endsWith(`@${uri}`))
    handle = handle.slice(0, -uri.length - 1)

  return handle
}

export function useAccountHandle(account: mastodon.v1.Account, fullServer = true) {
  return computed(() => fullServer
    ? getFullHandle(account)
    : getShortHandle(account),
  )
}
