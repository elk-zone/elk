import type { mastodon } from 'masto'

export function getDisplayName(account: mastodon.v1.Account, options?: { rich?: boolean }) {
  const displayName = account.displayName || account.username || account.acct || ''
  if (options?.rich)
    return displayName
  return displayName.replace(/:([\w-]+):/g, '')
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
  if (account.acct?.includes('@'))
    return account.acct.split('@')[1]
  // We should only lack the server name if we're on the same server as the account
  return currentInstance.value ? getInstanceDomain(currentInstance.value) : ''
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
