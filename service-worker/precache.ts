import type { RouteHandlerCallback } from 'workbox-core/types'
import type { PrecacheEntry, PrecacheRouteOptions } from 'workbox-precaching'
import { WorkboxError } from 'workbox-core/_private/WorkboxError'
import { PrecacheController, PrecacheRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { NetworkOnly } from 'workbox-strategies'

let precacheController: PrecacheController | undefined

class CustomPrecacheController extends PrecacheController {
  override createHandlerBoundToURL(url: string): RouteHandlerCallback {
    const cacheKey = this.getCacheKeyForURL(url)
    if (!cacheKey) {
      throw new WorkboxError('non-precached-url', { url })
    }
    const networkOnlyHandler = new NetworkOnly()
    return async (options) => {
      // check if present at precache before using network only
      if (options.request.mode !== 'navigate' || this.getCacheKeyForURL(options.request.url)) {
        options.request = new Request(url)
        options.params = { cacheKey, ...options.params }
        return await this.strategy.handle(options)
      }

      try {
        return await networkOnlyHandler.handle(options)
      }
      catch {
        // fallback with 404
        options.request = new Request(url)
        options.params = { cacheKey, ...options.params }
        return await this.strategy.handle(options)
      }
    }
  }
}
function getOrCreatePrecacheController(): PrecacheController {
  if (!precacheController) {
    precacheController = new CustomPrecacheController({
      fallbackToNetwork: false,
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
