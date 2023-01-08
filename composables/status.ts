import type { mastodon } from 'masto'

export const navigateToStatus = ({ status, focusReply = false }: { status: mastodon.v1.Status; focusReply?: boolean }) => {
  useNuxtApp().$rememberStatusPosition(status)
  navigateTo({ path: getStatusRoute(status).href, state: { focusReply } })
}
