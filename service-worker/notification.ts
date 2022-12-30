import { get } from 'idb-keyval'
import type { NotificationInfo, UserLogin } from './types'

export const findNotification = async (access_token: string, notificationId: string): Promise<NotificationInfo | undefined> => {
  const users = await get<UserLogin[]>('elk-users')
  if (!users)
    return undefined

  const filteredUsers = users.filter(user => user.token === access_token)
  if (!filteredUsers || filteredUsers.length === 0)
    return undefined

  for (const user of filteredUsers) {
    try {
      const response = await fetch(`https://${user.server}/api/v1/notifications/${notificationId}`, {
        method: 'get',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
      })
      if (!response || !response.ok)
        return undefined

      const notification = await response.json()

      if (user.server === notification.status?.server)
        return { user, notification }
    }
    catch {
      // just ignore
    }
  }

  return undefined
}
