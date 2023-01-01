/// <reference lib="WebWorker" />
/// <reference types="vite/client" />
import { createNotificationOptions, findNotification } from './notification'
import type { PushPayload } from '~/service-worker/types'

declare const self: ServiceWorkerGlobalScope

export const onPush = (event: PushEvent) => {
  const promise = isClientFocused().then((isFocused) => {
    if (isFocused)
      return Promise.resolve()

    const options: PushPayload = event.data!.json()

    return findNotification(options)
      .catch((e) => {
        console.error('unhandled error finding notification', e)
        return Promise.resolve(undefined)
      })
      .then((notificationInfo) => {
        return self.registration.showNotification(options.title, createNotificationOptions(options, notificationInfo))
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
