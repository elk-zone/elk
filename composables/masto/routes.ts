import type { mastodon } from 'masto'
import { withoutProtocol } from 'ufo'

export function getAccountRoute(account: mastodon.v1.Account) {
  return useRouter().resolve({
    name: 'account-index',
    params: {
      server: currentServer.value,
      account: extractAccountHandle(account),
    },
  })
}
export function getAccountFollowingRoute(account: mastodon.v1.Account) {
  return useRouter().resolve({
    name: 'account-following',
    params: {
      server: currentServer.value,
      account: extractAccountHandle(account),
    },
  })
}
export function getAccountFollowersRoute(account: mastodon.v1.Account) {
  return useRouter().resolve({
    name: 'account-followers',
    params: {
      server: currentServer.value,
      account: extractAccountHandle(account),
    },
  })
}

export function getReportRoute(id: string | number) {
  return `https://${currentUser.value?.server}/admin/reports/${encodeURIComponent(id)}`
}

export function getStatusRoute(status: mastodon.v1.Status) {
  return useRouter().resolve({
    name: 'status',
    params: {
      server: currentServer.value,
      account: extractAccountHandle(status.account),
      status: status.id,
    },
  })
}

export function getTagRoute(tag: string) {
  return useRouter().resolve({
    name: 'tag',
    params: {
      server: currentServer.value,
      tag,
    },
  })
}

export function getStatusPermalinkRoute(status: mastodon.v1.Status) {
  return status.url ? withoutProtocol(status.url) : null
}

export function getStatusInReplyToRoute(status: mastodon.v1.Status) {
  return useRouter().resolve({
    name: 'status-by-id',
    params: {
      server: currentServer.value,
      status: status.inReplyToId,
    },
  })
}

export function navigateToStatus({ status, focusReply = false }: {
  status: mastodon.v1.Status
  focusReply?: boolean
}) {
  return navigateTo({
    path: getStatusRoute(status).href,
    state: { focusReply },
  })
}
