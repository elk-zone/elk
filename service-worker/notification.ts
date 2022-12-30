import { get } from 'idb-keyval'
import type { Notification as MastoNotification } from 'masto'
import type { NotificationInfo, PushPayload, UserLogin } from './types'

export const findNotification = async (
  { access_token, notification_id/* , notification_type */ }: PushPayload,
): Promise<NotificationInfo | undefined> => {
  const users = await get<UserLogin[]>('elk-users')
  if (!users)
    return undefined

  const filteredUsers = users.filter(user => user.token === access_token)
  if (!filteredUsers || filteredUsers.length === 0)
    return undefined

  for (const user of filteredUsers) {
    try {
      const response = await fetch(`https://${user.server}/api/v1/notifications/${notification_id}`, {
        method: 'get',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
      })
      if (!response || !response.ok)
        return undefined

      const notification: MastoNotification = await response.json()

      // if (user.account.url === notification.status?.account?.url)
      // TODO review this
      return { user, notification }
    }
    catch {
      // just ignore
    }
  }

  return undefined
}
