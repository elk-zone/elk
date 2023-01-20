/// <reference lib="WebWorker" />
/// <reference types="vite/client" />
import { clientsClaim } from 'workbox-core'
import { registerRoute } from 'workbox-routing'
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { ExpirationPlugin } from 'workbox-expiration'
import { onNotificationClick, onPush } from './web-push-notifications'

declare let self: ServiceWorkerGlobalScope

self.skipWaiting()
clientsClaim()

if (import.meta.env.DEV) {
  // Avoid caching on dev: force always go to the server
  registerRoute(
    () => true,
    new NetworkFirst({
      cacheName: 'elk-dev',
      plugins: [
        new CacheableResponsePlugin({ statuses: [-1] }),
      ],
    }),
  )
}

if (import.meta.env.PROD) {
  const denyList: RegExp[] = [/^\/api\//, /^\/login\//, /^\/oauth\//, /^\/signin\//, /^\/web-share-target\//]
  const matchDenyList = (url: URL) => {
    const pathnameAndSearch = url.pathname + url.search
    for (const regExp of denyList) {
      if (regExp.test(pathnameAndSearch))
        return false
    }

    return true
  }
  // Cache page navigations (html) with a Network First strategy
  registerRoute(
    ({ sameOrigin, request, url }) => {
      return sameOrigin && request.mode === 'navigate' && matchDenyList(url)
    },
    new NetworkFirst({
      cacheName: 'elk-pages',
      plugins: [
        new CacheableResponsePlugin({ statuses: [200] }),
      ],
    }),
  )

  // Cache CSS, JS, and Web Worker requests with a Stale While Revalidate strategy
  registerRoute(
    ({ sameOrigin, request }) =>
      sameOrigin && (request.destination === 'style'
            || request.destination === 'manifest'
            || request.destination === 'script'
            || request.destination === 'worker'),
    new StaleWhileRevalidate({
      cacheName: 'elk-assets',
      plugins: [
        new CacheableResponsePlugin({ statuses: [200] }),
      ],
    }),
  )

  // include shiki cache
  registerRoute(
    ({ sameOrigin, url }) =>
      sameOrigin && url.pathname.startsWith('/shiki/'),
    new StaleWhileRevalidate({
      cacheName: 'elk-shiki',
      plugins: [
        new CacheableResponsePlugin({ statuses: [200] }),
        // 365 days max
        new ExpirationPlugin({ maxAgeSeconds: 60 * 60 * 24 * 365 }),
      ],
    }),
  )

  // Cache images with a Cache First strategy
  registerRoute(
    ({ sameOrigin, request }) =>
      sameOrigin && request.destination === 'image',
    new CacheFirst({
      cacheName: 'elk-images',
      plugins: [
        new CacheableResponsePlugin({ statuses: [200] }),
        // 150 max, 30 days max: purge on quota error
        new ExpirationPlugin({ purgeOnQuotaError: true, maxEntries: 150, maxAgeSeconds: 60 * 60 * 24 * 30 }),
      ],
    }),
  )
}

self.addEventListener('push', onPush)
self.addEventListener('notificationclick', onNotificationClick)
