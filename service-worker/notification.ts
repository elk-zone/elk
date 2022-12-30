import { get } from 'idb-keyval'
import type { NotificationInfo, UserLogin } from './types'

export const findNotification = async (access_token: string, notificationId: string): Promise<NotificationInfo | undefined> => {
  const users = await get<UserLogin[]>('elk-users')
  if (!users)
    return undefined

  const user = users.filter(user => user.token === access_token)
  if (!user || user.length === 0)
    return undefined

  for (const u of users) {
    try {
      const response = await fetch(`https://${u.server}/api/v1/notifications/${notificationId}`, {
        method: 'get',
        headers: {
          'Authorization': `Bearer ${u.token}`,
          'Content-Type': 'application/json',
        },
      })
      if (!response || !response.ok)
        return undefined

      const notification = await response.json()

      if (u.server === notification.status?.server)
        return { user: u, notification }
    }
    catch {
      // just ignore
    }
  }

  return undefined
}
