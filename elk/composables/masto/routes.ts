import type { akkoma } from 'akko'
import { withoutProtocol } from 'ufo'

export function getAccountRoute(account: akkoma.v1.Account) {
  return useRouter().resolve({
    name: 'account-index',
    params: {
      server: currentServer.value,
      account: extractAccountHandle(account),
    },
  })
}
export function getAccountFollowingRoute(account: akkoma.v1.Account) {
  return useRouter().resolve({
    name: 'account-following',
    params: {
      server: currentServer.value,
      account: extractAccountHandle(account),
    },
  })
}
export function getAccountFollowersRoute(account: akkoma.v1.Account) {
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

export function getStatusRoute(status: akkoma.v1.Status) {
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

export function getStatusPermalinkRoute(status: akkoma.v1.Status) {
  return status.url ? withoutProtocol(status.url) : null
}

export function getStatusInReplyToRoute(status: akkoma.v1.Status) {
  return useRouter().resolve({
    name: 'status-by-id',
    params: {
      server: currentServer.value,
      status: status.inReplyToId,
    },
  })
}

export function navigateToStatus({ status, focusReply = false }: {
  status: akkoma.v1.Status
  focusReply?: boolean
}) {
  return navigateTo({
    path: getStatusRoute(status).href,
    state: { focusReply },
  })
}
