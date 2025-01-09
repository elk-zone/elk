import type { Buffer } from 'node:buffer'
import type { Plugin } from 'vite'
import type { VitePluginPWAAPI } from 'vite-plugin-pwa'
import type { VitePWANuxtOptions } from './types'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { addPlugin, createResolver, defineNuxtModule } from '@nuxt/kit'
import { join, resolve } from 'pathe'
import { VitePWA } from 'vite-plugin-pwa'
import { configurePWAOptions } from './config'
import { createI18n, type LocalizedWebManifest, pwaLocales } from './i18n'

export * from './types'

export default defineNuxtModule<VitePWANuxtOptions>({
  meta: {
    name: 'elk-pwa',
    configKey: 'pwa',
  },
  defaults: nuxt => ({
    base: nuxt.options.app.baseURL,
    scope: nuxt.options.app.baseURL,
  }),
  async setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    let vitePwaClientPlugin: Plugin | undefined
    const resolveVitePluginPWAAPI = (): VitePluginPWAAPI | undefined => {
      return vitePwaClientPlugin?.api
    }

    nuxt.options.appConfig = nuxt.options.appConfig || {}
    nuxt.options.appConfig.pwaEnabled = !options.disable

    nuxt.options.nitro.publicAssets = nuxt.options.nitro.publicAssets || []
    const manifestDir = join(nuxt.options.buildDir, 'manifests')
    nuxt.options.nitro.publicAssets.push({
      dir: manifestDir,
      baseURL: '/',
      maxAge: 0,
    })

    // Register PWA types
    nuxt.hook('prepare:types', ({ references }) => {
      // TODO: remove this once JetBrains fixes the issue with types: remove also the dts file
      references.push({ path: resolver.resolve('runtime/types') })
      references.push({ types: 'vite-plugin-pwa/info' })
      references.push({ types: 'vite-plugin-pwa/vue' })
    })
    if (!options.disable) {
      // Inject $pwa helper throughout app
      addPlugin({ src: resolver.resolve('./runtime/pwa-plugin.client') })
    }

    // TODO: combine with configurePWAOptions?
    nuxt.hook('nitro:init', (nitro) => {
      options.outDir = nitro.options.output.publicDir
      options.injectManifest = options.injectManifest || {}
      options.injectManifest.globDirectory = nitro.options.output.publicDir
    })
    nuxt.hook('vite:extend', ({ config }) => {
      const plugin = config.plugins?.find(p => p && typeof p === 'object' && 'name' in p && p.name === 'vite-plugin-pwa')
      if (plugin)
        throw new Error('Remove vite-plugin-pwa plugin from Vite Plugins entry in Nuxt config file!')
    })
    nuxt.hook('vite:extendConfig', async (viteInlineConfig, { isClient }) => {
      viteInlineConfig.plugins = viteInlineConfig.plugins || []
      const plugin = viteInlineConfig.plugins.find(p => p && typeof p === 'object' && 'name' in p && p.name === 'vite-plugin-pwa')
      if (plugin)
        throw new Error('Remove vite-plugin-pwa plugin from Vite Plugins entry in Nuxt config file!')

      const webmanifest = await createI18n()
      const generateManifest = () => {
        return JSON.stringify(webmanifest)
      }

      if (isClient) {
        viteInlineConfig.plugins.push({
          name: 'elk:pwa:locales:build',
          apply: 'build',
          async writeBundle(_options, bundle) {
            if (options.disable || !bundle)
              return
            await mkdir(manifestDir, { recursive: true })
            await writeFile(join(manifestDir, `manifest.webmanifest`), generateManifest())
          },
        })
      }
      viteInlineConfig.plugins.push({
        name: 'elk:pwa:dev',
        apply: 'serve',
        configureServer(server) {
          const localeMatcher = new RegExp(`^${nuxt.options.app.baseURL}manifest.webmanifest$`)
          server.middlewares.use(async (req, res, next) => {
            const url = req.url
            if (!url)
              return next()

            const match = url.match(localeMatcher)
            const entry = match && webmanifest!
            if (entry) {
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/manifest+json')
              res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate')
              res.write(JSON.stringify(entry), 'utf-8')
              res.end()
              return
            }
            res.end()
          })
        },
      })

      configurePWAOptions(options, nuxt)
      const plugins = VitePWA(options)
      viteInlineConfig.plugins.push(plugins)
      if (isClient)
        vitePwaClientPlugin = plugins.find(p => p.name === 'vite-plugin-pwa') as Plugin
    })

    if (nuxt.options.dev) {
      const webManifesturl = `${nuxt.options.app.baseURL}${options.devOptions?.webManifestUrl ?? options.manifestFilename ?? 'manifest.webmanifest'}`
      const devSw = `${nuxt.options.app.baseURL}dev-sw.js?dev-sw`
      const workbox = `${nuxt.options.app.baseURL}workbox-`
      // @ts-expect-error just ignore
      const emptyHandle = (_req, _res, next) => {
        next()
      }
      nuxt.hook('vite:serverCreated', (viteServer, { isServer }) => {
        if (isServer)
          return

        viteServer.middlewares.stack.push({ route: webManifesturl, handle: emptyHandle })
        viteServer.middlewares.stack.push({ route: devSw, handle: emptyHandle })
      })

      if (!options.strategies || options.strategies === 'generateSW') {
        nuxt.hook('vite:serverCreated', (viteServer, { isServer }) => {
          if (isServer)
            return

          viteServer.middlewares.stack.push({ route: workbox, handle: emptyHandle })
        })
        nuxt.hook('close', async () => {
          // todo: cleanup dev-dist folder
        })
      }
    }
    else {
      nuxt.hook('nitro:config', async (nitroConfig) => {
        nitroConfig.routeRules = nitroConfig.routeRules || {}
        nitroConfig.routeRules!['/sw.js'] = {
          headers: {
            'Cache-Control': 'public, max-age=0, must-revalidate',
          },
        }
        nitroConfig.routeRules!['/elk-sw.js'] = {
          headers: {
            'Cache-Control': 'public, max-age=0, must-revalidate',
          },
        }
        for (const locale of pwaLocales) {
          nitroConfig.routeRules![`/manifest-${locale.code}.webmanifest`] = {
            headers: {
              'Content-Type': 'application/manifest+json',
              'Cache-Control': 'public, max-age=0, must-revalidate',
            },
          }
          nitroConfig.routeRules![`/manifest-${locale.code}-dark.webmanifest`] = {
            headers: {
              'Content-Type': 'application/manifest+json',
              'Cache-Control': 'public, max-age=0, must-revalidate',
            },
          }
        }
      })
      nuxt.hook('nitro:build:public-assets', async () => {
        await resolveVitePluginPWAAPI()?.generateSW()
      })
    }
  },
})
