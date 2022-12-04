import type { PushPayload } from '~/service-worker/types'

declare const self: ServiceWorkerGlobalScope

export const onPush = (event: PushEvent) => {
  const options: PushPayload = event.data!.json()
  const {
    access_token,
    body,
    icon,
    notification_id,
    notification_type,
    preferred_locale,
  } = options

  // TODO: check mention, there are 2 tabs but no page
  const url = notification_type === 'follow'
    ? 'notifications'
    : 'home'

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
    timestamp: new Date().getUTCDate(),
  }

  event.waitUntil(self.registration.showNotification(options.title, notificationOptions))
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
export const onNotificationClick = (event: NotificationEvent) => {
  const reactToNotificationClick = new Promise((resolve) => {
    event.notification.close()
    resolve(openUrl(event.notification.data.url))
  })

  event.waitUntil(reactToNotificationClick)
}
