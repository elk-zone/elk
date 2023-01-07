import type { Status } from 'masto'

export const navigateToStatus = ({ status, focusReply = false }: { status: Status; focusReply?: boolean }) => navigateTo({ path: getStatusRoute(status).href, state: { focusReply } })
