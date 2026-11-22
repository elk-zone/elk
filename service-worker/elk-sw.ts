/// <reference lib="WebWorker" />
/// <reference types="vite/client" />
import { CacheableResponsePlugin } from '@vite-pwa/workbox-swkit/cacheable-response'
import { ExpirationPlugin } from '@vite-pwa/workbox-swkit/expiration'
import { cleanupOutdatedCaches } from '@vite-pwa/workbox-swkit/precaching'
import { NavigationRoute, registerRoute } from '@vite-pwa/workbox-swkit/routing'
import { NetworkFirst, StaleWhileRevalidate } from '@vite-pwa/workbox-swkit/strategies'
import { createHandlerBoundToURL, precacheAndRoute } from './precache'
import { onShareTarget } from './share-target'
import { onNotificationClick, onPush } from './web-push-notifications'

declare const self: ServiceWorkerGlobalScope

if (import.meta.env.ENABLE_SWKIT_LOGS) {
  self.__WB_DISABLE_DEV_LOGS = false
}

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING')
    self.skipWaiting()
})

const entries = self.__WB_MANIFEST
if (import.meta.env.DEV) {
  entries.push({ url: '/', revision: Math.random().toString() })
}

// TODO: to enable parallel we need to change the custom precache module
precacheAndRoute(entries, /* , {
  parallel: {
    enabled: true,
    concurrency: 5,
  },
} */)

// clean old assets
cleanupOutdatedCaches()

// allow only fallback in dev: we don't want to cache anything
let allowlist: undefined | RegExp[]
if (import.meta.env.DEV)
  allowlist = [/^\/$/]

// deny api and server page calls
let denylist: undefined | RegExp[]
if (import.meta.env.PROD) {
  denylist = [
    /^\/api\//,
    /^\/login\//,
    /^\/oauth\//,
    /^\/signin\//,
    /^\/web-share-target\//,
    // exclude emoji: has its own cache
    /^\/emojis\//,
    // exclude sw: if the user navigates to it, fallback to index.html
    /^\/sw.js$/,
    /^\/elk-sw.js$/,
    /^\/elk-share-target-?:(.*).js$/,
    /^\/elk-push-notifications-?:(.*).js$/,
    /^\/workbox-?:(.*).js$/,
    // exclude webmanifest: has its own cache
    /^\/manifest-?:(.*).webmanifest$/,
  ]
}

// only cache pages and external assets on local build + start or in production
if (import.meta.env.PROD) {
  // include webmanifest cache
  registerRoute(
    ({ request, sameOrigin }) =>
      sameOrigin && request.destination === 'manifest',
    new NetworkFirst({
      cacheName: 'elk-webmanifest',
      plugins: [
        new CacheableResponsePlugin({ statuses: [200] }),
        // we only need a few entries
        new ExpirationPlugin({ maxEntries: 100 }),
      ],
    }),
  )
  // include emoji icons
  registerRoute(
    ({ sameOrigin, request, url }) =>
      sameOrigin
      && request.destination === 'image'
      && url.pathname.startsWith('/emojis/'),
    new StaleWhileRevalidate({
      cacheName: 'elk-emojis',
      plugins: [
        new CacheableResponsePlugin({ statuses: [200] }),
        // 15 days max
        new ExpirationPlugin({ purgeOnQuotaError: true, maxAgeSeconds: 60 * 60 * 24 * 15 }),
      ],
    }),
  )
  // external assets: rn avatars from mas.to
  // requires <img crossorigin="anonymous".../> and http header: Allow-Control-Allow-Origin: *
/*
  registerRoute(
    ({ sameOrigin, request }) => !sameOrigin && request.destination === 'image',
    new NetworkFirst({
      cacheName: 'elk-external-media',
      plugins: [
        // add opaque responses?
        new CacheableResponsePlugin({ statuses: [/!* 0, *!/200] }),
        // 15 days max
        new ExpirationPlugin({ maxAgeSeconds: 60 * 60 * 24 * 15 }),
      ],
    }),
  )
*/
}

// to allow work offline
registerRoute(new NavigationRoute(
  createHandlerBoundToURL('/'),
  { allowlist, denylist },
))

self.addEventListener('push', onPush)
self.addEventListener('notificationclick', onNotificationClick)
self.addEventListener('fetch', onShareTarget)

declare global {
  interface WorkerGlobalScope {
    __WB_DISABLE_DEV_LOGS: boolean
  }
}
