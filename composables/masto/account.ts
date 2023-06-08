import type { mastodon } from 'masto'

export interface AccountActionsProps {
  account: mastodon.v1.Account
}

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

export function useAccountActions(props: AccountActionsProps) {
  let account = $ref<mastodon.v1.Account>({ ...props.account })
  let relationship = $(useRelationship(account))
  const { client } = $(useMasto())

  const { t } = useI18n()

  watch(
    () => props.account,
    val => account = { ...val },
    { deep: true, immediate: true },
  )

  async function toggleMuteUser() {
    if (!relationship!.muting && await openConfirmDialog({
      title: t('confirm.mute_account.title', [account.acct]),
      confirm: t('confirm.mute_account.confirm'),
      cancel: t('confirm.mute_account.cancel'),
    }) !== 'confirm')
      return

    relationship!.muting = !relationship!.muting
    relationship = relationship!.muting
      ? await client.v1.accounts.mute(account.id, {
        // TODO support more options
      })
      : await client.v1.accounts.unmute(account.id)
  }

  async function toggleBlockUser() {
    if (!relationship!.blocking && await openConfirmDialog({
      title: t('confirm.block_account.title', [account.acct]),
      confirm: t('confirm.block_account.confirm'),
      cancel: t('confirm.block_account.cancel'),
    }) !== 'confirm')
      return

    relationship!.blocking = !relationship!.blocking
    relationship = await client.v1.accounts[relationship!.blocking ? 'block' : 'unblock'](account.id)
  }

  async function toggleBlockDomain() {
    if (!relationship!.domainBlocking && await openConfirmDialog({
      title: t('confirm.block_domain.title', [getServerName(account)]),
      confirm: t('confirm.block_domain.confirm'),
      cancel: t('confirm.block_domain.cancel'),
    }) !== 'confirm')
      return

    relationship!.domainBlocking = !relationship!.domainBlocking
    await client.v1.domainBlocks[relationship!.domainBlocking ? 'block' : 'unblock'](getServerName(account))
  }

  async function toggleReblogs() {
    if (!relationship!.showingReblogs && await openConfirmDialog({
      title: t('confirm.show_reblogs.title', [account.acct]),
      confirm: t('confirm.show_reblogs.confirm'),
      cancel: t('confirm.show_reblogs.cancel'),
    }) !== 'confirm')
      return

    const showingReblogs = !relationship?.showingReblogs
    relationship = await client.v1.accounts.follow(account.id, { reblogs: showingReblogs })
  }

  return {
    account: $$(account),
    relationship: $$(relationship),
    toggleMuteUser,
    toggleBlockUser,
    toggleBlockDomain,
    toggleReblogs,
  }
}
