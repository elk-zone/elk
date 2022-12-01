import type { Ref } from 'vue'
import type { Account, Relationship, Status } from 'masto'
import { withoutProtocol } from 'ufo'

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

export function getServerName(account: Account) {
  return account.url.match(UserLinkRE)?.[1] || currentUser.value?.server || ''
}

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
  return useRouter().resolve({
    name: 'account-index',
    params: {
      account: getFullHandle(account).slice(1),
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
      account: getFullHandle(status.account).slice(1),
      status: status.id,
    },
    state: {
      status: status as any,
    },
  })
}

export function getStatusPermalinkRoute(status: Status) {
  return status.url
    ? useRouter().resolve({
      name: 'permalink',
      params: { permalink: withoutProtocol(status.url) },
    })
    : null
}

export function getStatusInReplyToRoute(status: Status) {
  return useRouter().resolve({
    name: 'status-by-id',
    params: {
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
