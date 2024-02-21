import type { mastodon } from 'masto'
import type { Ref } from 'vue'

// Batch requests for relationships when used in the UI
// We don't want to hold to old values, so every time a Relationship is needed it
// is requested again from the server to show the latest state

const requestedRelationships = new Map<string, Ref<mastodon.v1.Relationship | undefined>>()
let timeoutHandle: NodeJS.Timeout | undefined

export function useRelationship(account: mastodon.v1.Account): Ref<mastodon.v1.Relationship | undefined> {
  if (!currentUser.value)
    return ref()
  let relationship = requestedRelationships.get(account.id)
  if (relationship)
    return relationship
  relationship = ref<mastodon.v1.Relationship | undefined>()
  requestedRelationships.set(account.id, relationship)
  if (timeoutHandle)
    clearTimeout(timeoutHandle)
  timeoutHandle = setTimeout(() => {
    timeoutHandle = undefined
    fetchRelationships()
  }, 100)
  return relationship
}

async function fetchRelationships() {
  const requested = Array.from(requestedRelationships.entries()).filter(([, r]) => !r.value)
  const relationships = await useMastoClient().v1.accounts.relationships.fetch({ id: requested.map(([id]) => id) })
  for (let i = 0; i < requested.length; i++)
    requested[i][1].value = relationships[i]
}

export async function toggleFollowAccount(relationship: mastodon.v1.Relationship, account: mastodon.v1.Account) {
  const { client } = useMasto()
  const i18n = useNuxtApp().$i18n

  const unfollow = relationship!.following || relationship!.requested

  if (unfollow) {
    if (await openConfirmDialog({
      title: i18n.t('confirm.unfollow.title'),
      description: i18n.t('confirm.unfollow.description', [`@${account.acct}`]),
      confirm: i18n.t('confirm.unfollow.confirm'),
      cancel: i18n.t('confirm.unfollow.cancel'),
    }) !== 'confirm')
      return
  }

  if (unfollow) {
    relationship!.following = false
    relationship!.requested = false
  }
  else if (account.locked) {
    relationship!.requested = true
  }
  else {
    relationship!.following = true
  }

  relationship = await client.value.v1.accounts.$select(account.id)[unfollow ? 'unfollow' : 'follow']()
}

export async function toggleMuteAccount(relationship: mastodon.v1.Relationship, account: mastodon.v1.Account) {
  const { client } = useMasto()
  const i18n = useNuxtApp().$i18n

  if (!relationship!.muting && await openConfirmDialog({
    title: i18n.t('confirm.mute_account.title'),
    description: i18n.t('confirm.mute_account.description', [account.acct]),
    confirm: i18n.t('confirm.mute_account.confirm'),
    cancel: i18n.t('confirm.mute_account.cancel'),
  }) !== 'confirm')
    return

  relationship!.muting = !relationship!.muting
  relationship = relationship!.muting
    ? await client.value.v1.accounts.$select(account.id).mute({
      // TODO support more options
    })
    : await client.value.v1.accounts.$select(account.id).unmute()
}

export async function toggleBlockAccount(relationship: mastodon.v1.Relationship, account: mastodon.v1.Account) {
  const { client } = useMasto()
  const i18n = useNuxtApp().$i18n

  if (!relationship!.blocking && await openConfirmDialog({
    title: i18n.t('confirm.block_account.title'),
    description: i18n.t('confirm.block_account.description', [account.acct]),
    confirm: i18n.t('confirm.block_account.confirm'),
    cancel: i18n.t('confirm.block_account.cancel'),
  }) !== 'confirm')
    return

  relationship!.blocking = !relationship!.blocking
  relationship = await client.value.v1.accounts.$select(account.id)[relationship!.blocking ? 'block' : 'unblock']()
}

export async function toggleBlockDomain(relationship: mastodon.v1.Relationship, account: mastodon.v1.Account) {
  const { client } = useMasto()
  const i18n = useNuxtApp().$i18n

  if (!relationship!.domainBlocking && await openConfirmDialog({
    title: i18n.t('confirm.block_domain.title'),
    description: i18n.t('confirm.block_domain.description', [getServerName(account)]),
    confirm: i18n.t('confirm.block_domain.confirm'),
    cancel: i18n.t('confirm.block_domain.cancel'),
  }) !== 'confirm')
    return

  relationship!.domainBlocking = !relationship!.domainBlocking
  await client.value.v1.domainBlocks[relationship!.domainBlocking ? 'create' : 'remove']({ domain: getServerName(account) })
}
