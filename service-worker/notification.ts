import type { MastoNotification, NotificationInfo, PushPayload, UserLogin } from './types'
import { closeDatabases, get } from '../utils/elk-idb'

export async function findNotification({ access_token, notification_id/* , notification_type */ }: PushPayload): Promise<NotificationInfo | undefined> {
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
      // assume it is ok to return the first notification: backend should return 404 if not found
      if (response && response.ok) {
        const notification: MastoNotification = await response.json()
        return { user, notification }
      }
    }
    catch {
      // just ignore
    }
  }

  return undefined
}

export function createNotificationOptions(
  pushPayload: PushPayload,
  notificationInfo?: NotificationInfo,
): NotificationOptions {
  const {
    access_token,
    body,
    icon,
    notification_id,
    notification_type,
    preferred_locale,
  } = pushPayload

  const url = notification_type === 'mention' ? 'notifications/mention' : 'notifications'

  const notificationOptions: NotificationOptions = {
    badge: '/pwa-192x192.png',
    body,
    data: {
      access_token,
      preferred_locale,
      url: `/${url}`,
    },
    dir: 'auto',
    icon,
    lang: preferred_locale,
    tag: notification_id,

    // @ts-expect-error error missing type, just ignore
    timestamp: new Date().getTime(),
  }

  if (notificationInfo) {
    const { user, notification } = notificationInfo
    notificationOptions.tag = notification.id
    /*
    if (notification.account.avatar_static)
      notificationOptions.icon = notification.account.avatar_static
*/
    if (notification.created_at) {
      // @ts-expect-error error missing type, just ignore
      notificationOptions.timestamp = new Date(notification.created_at).getTime()
    }

    /* TODO: add spoiler when actions available, checking also notification type
    if (notification.status && (notification.status.spoilerText || notification.status.sensitive)) {
      if (notification.status.spoilerText)
        notificationOptions.body = notification.status.spoilerText

      notificationOptions.image = undefined
    }
    */
    if (notification.status) {
      // notificationOptions.body = htmlToPlainText(notification.status.content)
      if (notification.status.media_attachments && notification.status.media_attachments.length > 0 && notification.status.media_attachments[0].preview_url) {
        // @ts-expect-error error missing type, just ignore
        notificationOptions.image = notification.status.media_attachments[0].preview_url
      }

      if (notification.type === 'favourite' || notification.type === 'reblog' || notification.type === 'mention')
        notificationOptions.data.url = `${user.server}/@${user.account.username}/${notification.status.id}`
    }
    else if (notification.type === 'follow') {
      notificationOptions.data.url = `${user.server}/@${notification.account.acct}`
    }
  }

  return notificationOptions
}

/*
function htmlToPlainText(html: string) {
  return decodeURIComponent(html.replace(/<br\s*\/?>/g, '\n').replace(/<\/p><p>/g, '\n\n').replace(/<[^>]*>/g, ''))
}
*/

export function closeDatabaseConnections() {
  closeDatabases()
}
