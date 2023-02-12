import { mkdir, writeFile } from 'node:fs/promises'
import { defineNuxtModule } from '@nuxt/kit'
import type { VitePluginPWAAPI } from 'vite-plugin-pwa'
import { VitePWA } from 'vite-plugin-pwa'
import type { Plugin } from 'vite'
import { join } from 'pathe'
import type { VitePWANuxtOptions } from './types'
import { configurePWAOptions } from './config'
import { type LocalizedWebManifest, createI18n, pwaLocales } from './i18n'

export * from './types'
export default defineNuxtModule<VitePWANuxtOptions>({
  meta: {
    name: 'pwa',
    configKey: 'pwa',
  },
  defaults: nuxt => ({
    base: nuxt.options.app.baseURL,
    scope: nuxt.options.app.baseURL,
  }),
  async setup(options, nuxt) {
    let vitePwaClientPlugin: Plugin | undefined
    const resolveVitePluginPWAAPI = (): VitePluginPWAAPI | undefined => {
      return vitePwaClientPlugin?.api
    }
    let webmanifests: LocalizedWebManifest | undefined

    nuxt.options.appConfig = nuxt.options.appConfig || {}
    nuxt.options.appConfig.pwaEnabled = !options.disable

    nuxt.options.nitro.publicAssets = nuxt.options.nitro.publicAssets || []
    const manifestDir = join(nuxt.options.buildDir, 'manifests')
    nuxt.options.nitro.publicAssets.push({
      dir: manifestDir,
      baseURL: '/',
      maxAge: 0,
    })
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

      webmanifests = await createI18n()
      const generateManifest = (entry: string) => {
        const manifest = webmanifests![entry]
        if (!manifest)
          throw new Error(`No webmanifest found for locale/theme ${entry}`)
        return JSON.stringify(manifest)
      }
      if (isClient) {
        viteInlineConfig.plugins.push({
          name: 'elk:pwa:locales:build',
          apply: 'build',
          async writeBundle(_options, bundle) {
            if (options.disable || !bundle)
              return
            await mkdir(manifestDir, { recursive: true })
            for (const wm in webmanifests)
              await writeFile(join(manifestDir, `manifest-${wm}.webmanifest`), generateManifest(wm))
          },
        })
      }
      viteInlineConfig.plugins.push({
        name: 'elk:pwa:locales:dev',
        apply: 'serve',
        configureServer(server) {
          const localeMatcher = new RegExp(`^${nuxt.options.app.baseURL}manifest-(.*).webmanifest$`)
          server.middlewares.use((req, res, next) => {
            const match = req.url?.match(localeMatcher)
            const entry = match && webmanifests![match[1]]
            if (entry) {
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/manifest+json')
              res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate')
              res.write(JSON.stringify(entry), 'utf-8')
              res.end()
            }
            else {
              next()
            }
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
      const webManifest = `${nuxt.options.app.baseURL}${options.devOptions?.webManifestUrl ?? options.manifestFilename ?? 'manifest.webmanifest'}`
      const devSw = `${nuxt.options.app.baseURL}dev-sw.js?dev-sw`
      const workbox = `${nuxt.options.app.baseURL}workbox-`
      // @ts-expect-error just ignore
      const emptyHandle = (_req, _res, next) => {
        next()
      }
      nuxt.hook('vite:serverCreated', (viteServer, { isServer }) => {
        if (isServer)
          return

        viteServer.middlewares.stack.push({ route: webManifest, handle: emptyHandle })
        if (webmanifests) {
          Object.keys(webmanifests).forEach((wm) => {
            viteServer.middlewares.stack.push({
              route: `${nuxt.options.app.baseURL}manifest-${wm}.webmanifest`,
              handle: emptyHandle,
            })
          })
        }
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
      nuxt.hook('nitro:init', (nitro) => {
        nitro.hooks.hook('rollup:before', async () => {
          await resolveVitePluginPWAAPI()?.generateSW()
        })
      })
    }
  },
})
