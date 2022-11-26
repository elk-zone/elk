import type { Ref } from 'vue'
import type { Account, Relationship, Status } from 'masto'

declare module 'masto' {
  interface Status {
    editedAt?: string
  }
}

// @unocss-include
export const STATUS_VISIBILITIES = [
  {
    value: 'public',
    label: 'Public',
    icon: 'i-ri:global-line',
    description: 'Visible for all',
  },
  {
    value: 'unlisted',
    label: 'Unlisted',
    icon: 'i-ri:lock-unlock-line',
    description: 'Visible for all, but opted-out of discovery features',
  },
  {
    value: 'private',
    label: 'Followers only',
    icon: 'i-ri:lock-line',
    description: 'Visible for followers only',
  },
  {
    value: 'direct',
    label: 'Mentioned people only',
    icon: 'i-ri:at-line',
    description: 'Visible for mentioned users only',
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

export function getShortHandle(account: Account) {
  return `@${account.acct}`
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

export function getAccountPath(account: Account) {
  return `/${getFullHandle(account)}`
}

export function getStatusPath(status: Status) {
  return `/${getFullHandle(status.account)}/${status.id}`
}

export function getStatusInReplyToPath(status: Status) {
  return `/status/${status.inReplyToId}`
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
  const requested = Array.from(requestedRelationships.entries())
  requestedRelationships.clear()

  const relationships = await masto.accounts.fetchRelationships(requested.map(([id]) => id))
  for (let i = 0; i < requested.length; i++)
    requested[i][1].value = relationships[i]
}
