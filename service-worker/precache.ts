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
