import type { akkoma } from '@bdxtown/akko'
import type { Ref } from 'vue'

// Batch requests for relationships when used in the UI
// We don't want to hold to old values, so every time a Relationship is needed it
// is requested again from the server to show the latest state

const requestedRelationships = new Map<string, Ref<akkoma.v1.Relationship | undefined>>()
let timeoutHandle: NodeJS.Timeout | undefined

// allow debounced batch relationship requests
export function fetchRelationships(account: akkoma.v1.Account, relationship: Ref<akkoma.v1.Relationship | undefined>, ignoreCache = false) {
  requestedRelationships.set(account.id, relationship)
  if (timeoutHandle)
    clearTimeout(timeoutHandle)
  timeoutHandle = setTimeout(async () => {
    timeoutHandle = undefined
    const requested = Array.from(requestedRelationships.entries()).filter(([, r]) => ignoreCache || !r.value)
    const relationships = await useAkkoClient().v1.accounts.relationships.fetch({ id: requested.map(([id]) => id) })
    for (const rs of relationships) {
      const requestedToUpdate = requested.find(([id]) => id === rs.id)
      if (!requestedToUpdate)
        continue
      requestedToUpdate[1].value = rs
    }
  }, 100)
}

export function useRelationship(account: akkoma.v1.Account): Ref<akkoma.v1.Relationship | undefined> {
  if (!currentUser.value)
    return ref()

  let relationship = requestedRelationships.get(account.id)
  if (relationship)
    return relationship

  relationship = ref<akkoma.v1.Relationship | undefined>()
  fetchRelationships(account, relationship)

  return relationship
}

export async function toggleFollowAccount(relationship: akkoma.v1.Relationship, account: akkoma.v1.Account) {
  const { client } = useAkko()
  const i18n = useNuxtApp().$i18n

  const unfollow = relationship!.following || relationship!.requested

  if (unfollow) {
    const confirmUnfollow = await openConfirmDialog({
      title: i18n.t('confirm.unfollow.title'),
      description: i18n.t('confirm.unfollow.description', [`@${account.acct}`]),
      confirm: i18n.t('confirm.unfollow.confirm'),
      cancel: i18n.t('confirm.unfollow.cancel'),
    })
    if (confirmUnfollow.choice !== 'confirm')
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

  const updatedRelationship = await client.value.v1.accounts.$select(account.id)[unfollow ? 'unfollow' : 'follow']()
  Object.assign(relationship, updatedRelationship)
  return updatedRelationship
}

export async function toggleMuteAccount(relationship: akkoma.v1.Relationship, account: akkoma.v1.Account) {
  const { client } = useAkko()
  const i18n = useNuxtApp().$i18n

  let duration = 0 // default 0 == indefinite
  let notifications = true // default true = mute notifications
  if (!relationship!.muting) {
    const confirmMute = await openConfirmDialog({
      title: i18n.t('confirm.mute_account.title'),
      description: i18n.t('confirm.mute_account.description', [account.acct]),
      confirm: i18n.t('confirm.mute_account.confirm'),
      cancel: i18n.t('confirm.mute_account.cancel'),
      extraOptionType: 'mute',
    })
    if (confirmMute.choice !== 'confirm')
      return

    duration = confirmMute.extraOptions!.mute.duration
    notifications = confirmMute.extraOptions!.mute.notifications
  }

  relationship!.muting = !relationship!.muting
  const updatedRelationship = relationship!.muting
    ? await client.value.v1.accounts.$select(account.id).mute({
      duration,
      notifications,
    })
    : await client.value.v1.accounts.$select(account.id).unmute()
  Object.assign(relationship, updatedRelationship)
  return updatedRelationship
}

export async function toggleBlockAccount(relationship: akkoma.v1.Relationship, account: akkoma.v1.Account) {
  const { client } = useAkko()
  const i18n = useNuxtApp().$i18n

  if (!relationship!.blocking) {
    const confirmBlock = await openConfirmDialog({
      title: i18n.t('confirm.block_account.title'),
      description: i18n.t('confirm.block_account.description', [account.acct]),
      confirm: i18n.t('confirm.block_account.confirm'),
      cancel: i18n.t('confirm.block_account.cancel'),
    })
    if (confirmBlock.choice !== 'confirm')
      return
  }

  relationship!.blocking = !relationship!.blocking
  // user stops following when blocking
  if (relationship!.blocking)
    relationship!.following = false
  const updatedRelationship = await client.value.v1.accounts.$select(account.id)[relationship!.blocking ? 'block' : 'unblock']()
  Object.assign(relationship, updatedRelationship)
  return updatedRelationship
}

export async function toggleBlockDomain(relationship: akkoma.v1.Relationship, account: akkoma.v1.Account) {
  const { client } = useAkko()
  const i18n = useNuxtApp().$i18n

  if (!relationship!.domainBlocking) {
    const confirmDomainBlock = await openConfirmDialog({
      title: i18n.t('confirm.block_domain.title'),
      description: i18n.t('confirm.block_domain.description', [getServerName(account)]),
      confirm: i18n.t('confirm.block_domain.confirm'),
      cancel: i18n.t('confirm.block_domain.cancel'),
    })
    if (confirmDomainBlock.choice !== 'confirm')
      return
  }

  relationship!.domainBlocking = !relationship!.domainBlocking
  const updatedRelationship = await client.value.v1.domainBlocks[relationship!.domainBlocking ? 'create' : 'remove']({ domain: getServerName(account) })
  Object.assign(relationship, updatedRelationship)
  return updatedRelationship
}
