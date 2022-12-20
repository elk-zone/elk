import type { Ref } from 'vue'
import type { Account, Relationship, Status } from 'masto/fetch'
import { withoutProtocol } from 'ufo'
import type { ElkMasto } from '~/types'

export const useMasto = () => useNuxtApp().$masto as ElkMasto

export const isMastoInitialised = computed(() => process.client && useMasto().loggedIn.value)

// @unocss-include
export const STATUS_VISIBILITIES = [
  {
    value: 'public',
    icon: 'i-ri:global-line',
  },
  {
    value: 'unlisted',
    icon: 'i-ri:lock-unlock-line',
  },
  {
    value: 'private',
    icon: 'i-ri:lock-line',
  },
  {
    value: 'direct',
    icon: 'i-ri:at-line',
  },
] as const

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
  if (account.acct.includes('@'))
    return account.acct.split('@')[1]
  // We should only lack the server name if we're on the same server as the account
  return currentInstance.value?.uri || ''
}

export function getFullHandle(account: Account) {
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

export function getAccountRoute(account: Account) {
  let handle = getFullHandle(account).slice(1)
  const uri = currentInstance.value?.uri ?? currentServer.value
  if (currentInstance.value && handle.endsWith(`@${uri}`))
    handle = handle.slice(0, -uri.length - 1)

  return useRouter().resolve({
    name: 'account-index',
    params: {
      server: currentServer.value,
      account: handle,
    },
    state: {
      account: account as any,
    },
  })
}
export function getAccountFollowingRoute(account: Account) {
  return useRouter().resolve({
    name: 'account-following',
    params: {
      server: currentServer.value,
      account: getFullHandle(account).slice(1),
    },
    state: {
      account: account as any,
    },
  })
}
export function getAccountFollowersRoute(account: Account) {
  return useRouter().resolve({
    name: 'account-followers',
    params: {
      server: currentServer.value,
      account: getFullHandle(account).slice(1),
    },
    state: {
      account: account as any,
    },
  })
}

export function getStatusRoute(status: Status) {
  return useRouter().resolve({
    name: 'status',
    params: {
      server: currentServer.value,
      account: getFullHandle(status.account).slice(1),
      status: status.id,
    },
    state: {
      status: status as any,
    },
  })
}

export function getStatusPermalinkRoute(status: Status) {
  return status.url ? withoutProtocol(status.url) : null
}

export function getStatusInReplyToRoute(status: Status) {
  return useRouter().resolve({
    name: 'status-by-id',
    params: {
      server: currentServer.value,
      status: status.inReplyToId,
    },
  })
}

export function useAccountHandle(account: Account, fullServer = true) {
  return computed(() => fullServer
    ? getFullHandle(account)
    : getShortHandle(account),
  )
}

// Batch requests for relationships when used in the UI
// We don't want to hold to old values, so every time a Relationship is needed it
// is requested again from the server to show the latest state

const requestedRelationships = new Map<string, Ref<Relationship | undefined>>()
let timeoutHandle: NodeJS.Timeout | undefined

export function useRelationship(account: Account): Ref<Relationship | undefined> {
  if (!currentUser.value)
    return ref()
  let relationship = requestedRelationships.get(account.id)
  if (relationship)
    return relationship
  relationship = ref<Relationship | undefined>()
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
  const relationships = await useMasto().accounts.fetchRelationships(requested.map(([id]) => id))
  for (let i = 0; i < requested.length; i++)
    requested[i][1].value = relationships[i]
}
