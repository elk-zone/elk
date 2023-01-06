import type { Account } from 'masto'
import type { UserLogin } from '~/types'

export function getDisplayName(account?: Account, options?: { rich?: boolean }) {
  const displayName = account?.displayName || account?.username || ''
  if (options?.rich)
    return displayName
  return displayName.replace(/:([\w-]+?):/g, '')
}

export function getShortHandle({ acct }: Account) {
  if (!acct)
    return ''
  return `@${acct.includes('@') ? acct.split('@')[0] : acct}`
}

export function getServerName(account: Account) {
  if (account.acct?.includes('@'))
    return account.acct.split('@')[1]
  // We should only lack the server name if we're on the same server as the account
  return currentInstance.value?.uri || ''
}

export function getFullHandle(_account: Account | UserLogin) {
  if ('guest' in _account && _account.guest)
    return `${GUEST_ID}@${_account.server}`

  const account = 'server' in _account ? _account.account : _account
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

export function extractAccountHandle(account: Account) {
  let handle = getFullHandle(account).slice(1)
  const uri = currentInstance.value?.uri ?? currentServer.value
  if (currentInstance.value && handle.endsWith(`@${uri}`))
    handle = handle.slice(0, -uri.length - 1)

  return handle
}

export function useAccountHandle(account: Account, fullServer = true) {
  return computed(() => fullServer
    ? getFullHandle(account)
    : getShortHandle(account),
  )
}
