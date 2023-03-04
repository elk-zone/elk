import type { Nuxt } from '@nuxt/schema'
import type { VitePWAOptions } from 'vite-plugin-pwa'
import { resolve } from 'pathe'

export function configurePWAOptions(options: Partial<VitePWAOptions>, nuxt: Nuxt) {
  if (!options.outDir) {
    const publicDir = nuxt.options.nitro?.output?.publicDir
    options.outDir = publicDir ? resolve(publicDir) : resolve(nuxt.options.buildDir, '../.output/public')
  }

  let config: Partial<
    import('workbox-build').BasePartial
    & import('workbox-build').GlobPartial
    & import('workbox-build').RequiredGlobDirectoryPartial
    >

  if (options.strategies === 'injectManifest') {
    options.injectManifest = options.injectManifest ?? {}
    config = options.injectManifest
  }
  else {
    options.workbox = options.workbox ?? {}
    if (options.registerType === 'autoUpdate' && (options.injectRegister === 'script' || options.injectRegister === 'inline')) {
      options.workbox.clientsClaim = true
      options.workbox.skipWaiting = true
    }
    if (nuxt.options.dev) {
      // on dev force always to use the root

      options.workbox.navigateFallback = nuxt.options.app.baseURL ?? '/'
      if (options.devOptions?.enabled && !options.devOptions.navigateFallbackAllowlist)
        options.devOptions.navigateFallbackAllowlist = [new RegExp(nuxt.options.app.baseURL) ?? /\//]
    }
    config = options.workbox
    // todo: change navigateFallback based on the command: use 404 only when using generate
    /* else if (nuxt.options.build) {
      if (!options.workbox.navigateFallback)
        options.workbox.navigateFallback = '/200.html'
    } */
  }
  if (!nuxt.options.dev)
    config.manifestTransforms = [createManifestTransform(nuxt.options.app.baseURL ?? '/')]
}

function createManifestTransform(base: string): import('workbox-build').ManifestTransform {
  return async (entries) => {
    // prefix non html assets with base
    /*
    entries.filter(e => e && !e.url.endsWith('.html')).forEach((e) => {
      if (!e.url.startsWith(base))
        e.url = `${base}${e.url}`
    })
*/
    entries.filter(e => e && e.url.endsWith('.html')).forEach((e) => {
      const url = e.url.startsWith('/') ? e.url.slice(1) : e.url
      if (url === 'index.html') {
        e.url = base
      }
      else {
        const parts = url.split('/')
        parts[parts.length - 1] = parts[parts.length - 1].replace(/\.html$/, '')
        // e.url = `${base}${parts.length > 1 ? parts.slice(0, parts.length - 1).join('/') : parts[0]}`
        e.url = parts.length > 1 ? parts.slice(0, parts.length - 1).join('/') : parts[0]
      }
    })

    return { manifest: entries, warnings: [] }
  }
}
