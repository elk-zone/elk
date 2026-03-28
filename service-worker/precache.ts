import type { RouteHandlerCallback } from 'workbox-core/types'
import type { PrecacheEntry, PrecacheRouteOptions } from 'workbox-precaching'
import { WorkboxError } from 'workbox-core/_private/WorkboxError'
import { PrecacheController, PrecacheRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'

let precacheController: PrecacheController | undefined

class CustomPrecacheController extends PrecacheController {
  override createHandlerBoundToURL(url: string): RouteHandlerCallback {
    const cacheKey = this.getCacheKeyForURL(url)
    if (!cacheKey) {
      throw new WorkboxError('non-precached-url', { url })
    }
    return async (options) => {
      // check if present at precache before falling back to network
      if (await this.matchPrecache(options.request)) {
        options.request = new Request(url)
        options.params = { cacheKey, ...options.params }
      }

      return await this.strategy.handle(options)
    }
  }
}
function getOrCreatePrecacheController(): PrecacheController {
  if (!precacheController) {
    precacheController = new CustomPrecacheController({
      fallbackToNetwork: true,
      /*
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
        fetchDidFail: async ({ error }) => {
          console.error('fetchDidFail', error)
        },
        handlerDidError: async ({ error }) => {
          console.error('handlerDidError', error)
          return undefined
        },
      }],
         */
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
