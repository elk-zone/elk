import type { RouteHandlerCallbackOptions } from 'workbox-core/src/types'
import type { RouteHandlerCallback } from 'workbox-core/types'
import type { PrecacheEntry, PrecacheRouteOptions } from 'workbox-precaching'
import { WorkboxError } from 'workbox-core/_private/WorkboxError'
import { PrecacheController, PrecacheRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { NetworkOnly } from 'workbox-strategies'

let precacheController: PrecacheController | undefined

const pages = [
  '/blocks',
  '/bookmarks',
  '/compose',
  '/conversations',
  '/domain_blocks',
  '/explore',
  '/explore/links',
  '/explore/tags',
  '/favourites',
  '/hashtags',
  '/home',
  '/intent/post',
  '/lists',
  '/mutes',
  '/notifications',
  '/notifications/mentions',
  '/pinned',
  '/public',
  '/public/local',
  '/scheduled-post',
  '/scheduled-posts',
  '/search',
  '/shared-target',
] as const

async function getCacheResponse(
  controller: PrecacheController,
  url: string,
  options: RouteHandlerCallbackOptions,
): Promise<Response | undefined> {
  const pathname = new URL(url).pathname
  // since we have "nitro.prerender.crawlLinks = true" we need to include here
  // any page not being prerendered
  if (pathname.startsWith('/settings')) {
    return undefined
  }
  for (const page of pages) {
    if (pathname.endsWith(page)) {
      const idx = url.indexOf(page)
      if (idx > -1) {
        const newUrl = new URL(url.slice(idx), url)
        const cacheKey = controller.getCacheKeyForURL(newUrl.href)
        if (!cacheKey) {
          return undefined
        }
        options.request = new Request(newUrl.pathname)
        options.params = { cacheKey, ...options.params }
        return await controller.strategy.handle(options)
      }
      return undefined
    }
  }

  return undefined
}

class CustomPrecacheController extends PrecacheController {
  override createHandlerBoundToURL(url: string): RouteHandlerCallback {
    const cacheKey = this.getCacheKeyForURL(url)
    if (!cacheKey) {
      throw new WorkboxError('non-precached-url', { url })
    }

    const networkOnlyHandler = new NetworkOnly()
    return async (options) => {
      // if present in the cache: this will resolve /public or /public/local for example
      if (this.getCacheKeyForURL(options.request.url)) {
        options.request = new Request(url)
        options.params = { cacheKey, ...options.params }
        return await this.strategy.handle(options)
      }

      // check if present at precache before using network only
      // <host>/<page> => check for /<page> at cache = if present get it
      const response = await getCacheResponse(
        this,
        options.request.url,
        options,
      )
      if (response)
        return response

      try {
        return await networkOnlyHandler.handle(options)
      }
      catch {
        // fallback
        options.request = new Request(url)
        options.params = { cacheKey, ...options.params }
        return await this.strategy.handle(options)
      }
    }
  }
}
function getOrCreatePrecacheController(): PrecacheController {
  if (!precacheController) {
    precacheController
      = import.meta.env.DEV
        ? new PrecacheController()
        : new CustomPrecacheController()
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
