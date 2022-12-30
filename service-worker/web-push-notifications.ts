/// <reference lib="WebWorker" />
/// <reference types="vite/client" />
import { findNotification } from './notification'
import type { PushPayload } from '~/service-worker/types'

declare const self: ServiceWorkerGlobalScope

export const onPush = (event: PushEvent) => {
  const promise = isClientFocused().then((isFocused) => {
    if (isFocused)
      return Promise.resolve()

    const options: PushPayload = event.data!.json()
    const {
      access_token,
      body,
      icon,
      notification_id,
      notification_type,
      preferred_locale,
    } = options

    return findNotification(access_token, notification_id)
      .catch((e) => {
        console.error('unhandled error finding notification', e)
        return Promise.resolve(undefined)
      })
      .then((data) => {
        let url = notification_type === 'mention' ? 'notifications/mention' : 'notifications'
        if (data && data.notification.status) {
          const { user, notification } = data
          url = `${user.server}/@${user.account.username}/${notification.status!.id}`
        }

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
          timestamp: new Date().getTime(),
        }
        return self.registration.showNotification(options.title, notificationOptions)
      })
  })

  event.waitUntil(promise)
}

export const onNotificationClick = (event: NotificationEvent) => {
  const reactToNotificationClick = new Promise((resolve) => {
    event.notification.close()
    resolve(openUrl(event.notification.data.url))
  })

  event.waitUntil(reactToNotificationClick)
}

function findBestClient(clients: WindowClient[]) {
  const focusedClient = clients.find(client => client.focused)
  const visibleClient = clients.find(client => client.visibilityState === 'visible')

  return focusedClient || visibleClient || clients[0]
}

async function openUrl(url: string) {
  const clients = await self.clients.matchAll({ type: 'window' })
  // Chrome 42-48 does not support navigate
  if (clients.length !== 0 && 'navigate' in clients[0]) {
    const client = findBestClient(clients as WindowClient[])
    await client.navigate(url).then(client => client?.focus())
  }

  await self.clients.openWindow(url)
}

function isClientFocused() {
  return self.clients
    .matchAll({ type: 'window', includeUncontrolled: true })
    .then(windowClients => Promise.resolve(windowClients.some(windowClient => windowClient.focused)))
}
