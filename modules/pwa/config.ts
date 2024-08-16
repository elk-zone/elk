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
  }
  let buildAssetsDir = nuxt.options.app.buildAssetsDir ?? '_nuxt/'
  if (buildAssetsDir[0] === '/')
    buildAssetsDir = buildAssetsDir.slice(1)
  if (buildAssetsDir[buildAssetsDir.length - 1] !== '/')
    buildAssetsDir += '/'

  // Vite 5 support: allow override dontCacheBustURLsMatching
  if (!('dontCacheBustURLsMatching' in config))
    config.dontCacheBustURLsMatching = new RegExp(buildAssetsDir)

  // handle payload extraction
  if (nuxt.options.experimental.payloadExtraction) {
    config.globPatterns = config.globPatterns ?? []
    config.globPatterns.push('**/_payload.json')
  }

  // handle Nuxt App Manifest
  let appManifestFolder: string | undefined
  if (nuxt.options.experimental.appManifest) {
    config.globPatterns = config.globPatterns ?? []
    appManifestFolder = `${buildAssetsDir}builds/`
    config.globPatterns.push(`${appManifestFolder}**/*.json`)
  }

  if (!nuxt.options.dev)
    config.manifestTransforms = [createManifestTransform(nuxt.options.app.baseURL ?? '/', appManifestFolder)]
}

function createManifestTransform(base: string, appManifestFolder?: string): import('workbox-build').ManifestTransform {
  return async (entries) => {
    entries.filter(e => e && e.url.endsWith('.html')).forEach((e) => {
      const url = e.url.startsWith('/') ? e.url.slice(1) : e.url
      if (url === 'index.html') {
        e.url = base
      }
      else {
        const parts = url.split('/')
        parts[parts.length - 1] = parts[parts.length - 1].replace(/\.html$/, '')
        e.url = parts.length > 1 ? parts.slice(0, parts.length - 1).join('/') : parts[0]
      }
    })

    if (appManifestFolder) {
      const regExp = /\/?[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.json$/i
      // we need to remove the revision from the sw prechaing manifest, UUID is enough:
      // we don't use dontCacheBustURLsMatching, single regex
      entries.filter(e => e && e.url.startsWith(appManifestFolder) && regExp.test(e.url)).forEach((e) => {
        e.revision = null
      })
    }

    return { manifest: entries, warnings: [] }
  }
}
