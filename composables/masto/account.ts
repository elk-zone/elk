import type { mastodon } from 'masto'
import type { ShallowUnwrapRef } from 'vue'

export function getDisplayName(account: mastodon.v1.Account, options?: { rich?: boolean }) {
  const displayName = account.displayName || account.username || account.acct || ''
  if (options?.rich)
    return displayName
  return displayName.replace(/:([\w-]+?):/g, '')
}

export function accountToShortHandle(acct: string) {
  return `@${acct.includes('@') ? acct.split('@')[0] : acct}`
}

export function getShortHandle(account: mastodon.v1.Account | ShallowUnwrapRef<mastodon.v1.Account>) {
  if (account && account.acct)
    return accountToShortHandle(account.acct)
  return ''
}

export function getServerName(account?: mastodon.v1.Account | ShallowUnwrapRef<mastodon.v1.Account>) {
  if (account && account.acct && account.url) {
    const webDomain = account.acct.split('@')
    return (webDomain.length === 2 && webDomain[1].includes('.')) ? webDomain[1] : account.url.replace('https://', '').split('/')[0]
  }
  return ''
}

export function getFullHandle(account: mastodon.v1.Account | ShallowUnwrapRef<mastodon.v1.Account>) {
  if (account && account.acct && account.acct && account.url) {
    const handle = `@${account.username}@${getServerName(account)}`
    return (currentUser.value?.server) ? handle.replace(`@${currentUser.value?.server}`, '') : handle
  }
  return ''
}

export function rawAcctToResolvedAccount(acct: string) {
  return fetchAccountByHandle(`@${acct}`)
}

export function getAcctFromPerspectiveOfCurrentServer(account?: mastodon.v1.Account | ShallowUnwrapRef<mastodon.v1.Account>) {
  if (account && account.acct && account.acct && account.url)
    return `${account.username}@${getServerName(account)}`?.replace(`@${currentServer.value}`, '')

  return ''
}

export function parseAcctFromPerspectiveOfCurrentServer(webfingerOrUriOrUrl: string) {
  // see https://github.com/mastodon/mastodon/blob/25c66fa640962a4d54d59a3f53516ab6dcb1dae6/app/models/concerns/omniauthable.rb#L95
  if (webfingerOrUriOrUrl.search(/^@[a-z0-9_]{1,30}$/i) === 0)
    return webfingerOrUriOrUrl

  return extractAccountWebfinger(webfingerOrUriOrUrl)?.replace(`@${currentServer.value}`, '') ?? undefined
}
