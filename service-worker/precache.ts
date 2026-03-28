import type { RouteHandlerCallback } from 'workbox-core/types'
import type { PrecacheEntry, PrecacheRouteOptions } from 'workbox-precaching'
import { PrecacheController, PrecacheRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'

let precacheController: PrecacheController | undefined

function getOrCreatePrecacheController(): PrecacheController {
  if (!precacheController) {
    precacheController = new PrecacheController({
      fallbackToNetwork: true,
      plugins: [{
        requestWillFetch: async ({ request, state }) => {
          state ??= {}
          // store original cache to prevent hit fallback via allowlist
          // this should prevent PrecacheCacheKeyPlugin match fallback the allowlist
          // when using registerRouter(new NavigationRoute(...)) forcing network fetch
          // since we'll return undefined at cachedResponseWillBeUsed
          state.originalCacheKey = precacheController!.getCacheKeyForURL(request.url)
          // eslint-disable-next-line no-console
          console.info('requestWillFetch', state)
          return request
        },
        cacheWillUpdate: async ({ response, state }) => {
          return state?.originalCacheKey ? response : undefined
        },
        cachedResponseWillBeUsed: async ({ cachedResponse, state }) => {
          return state?.originalCacheKey ? cachedResponse : undefined
        },
        /* cacheKeyWillBeUsed: async ({ request, state }) => {
          const originalCacheKey: string | undefined = state?.originalCacheKey
          // eslint-disable-next-line no-console
          console.info('cacheKeyWillBeUsed::originalCacheKey', originalCacheKey)
          if (!originalCacheKey) {
            const cacheKey = precacheController!.getCacheKeyForURL(request.url)
            // eslint-disable-next-line no-console
            console.info('cacheKeyWillBeUsed::cacheKey', cacheKey)
            if (cacheKey && cacheKey !== originalCacheKey) {
              // eslint-disable-next-line no-console
              console.log('cacheKeyWillBeUsed::originalHeaders', state?.originalHeaders)
              // eslint-disable-next-line no-console
              console.log('cacheKeyWillBeUsed::headers', request.headers)
              // this should prevent PrecacheCacheKeyPlugin match fallback the allowlist
              // when using registerRouter(new NavigationRoute(...)) forcing network fetch
              return new Request(originalCacheKey, { headers: request.headers })
            }
          }
          return request
        }, */
        fetchDidFail: async ({ error }) => {
          console.error('fetchDidFail', error)
        },
        handlerDidError: async ({ error }) => {
          console.error('handlerDidError', error)
          return undefined
        },
      }],
    })
  }
  return precacheController
}

export function createHandlerBoundToURL(url: string): RouteHandlerCallback {
  const precacheController = getOrCreatePrecacheController()
  return precacheController.createHandlerBoundToURL(url)
}
function precache(entries: Array<PrecacheEntry | string>): void {
  const precacheController = getOrCreatePrecacheController()
  precacheController.precache(entries)
}
function addRoute(options?: PrecacheRouteOptions): void {
  const precacheController = getOrCreatePrecacheController()

  const precacheRoute = new PrecacheRoute(precacheController, options)
  registerRoute(precacheRoute)
}

export function precacheAndRoute(
  entries: Array<PrecacheEntry | string>,
  options?: PrecacheRouteOptions,
): void {
  precache(entries)
  addRoute(options)
}
