import { addServerHandler, createResolver, defineNuxtModule, resolvePath } from '@nuxt/kit'
import type { VitePluginPWAAPI } from 'vite-plugin-pwa'
import { VitePWA } from 'vite-plugin-pwa'
import type { Plugin } from 'vite'
import { joinURL } from 'ufo'
import type { VitePWANuxtOptions } from './types'
import { configurePWAOptions } from './config'

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
    const resolver = createResolver(import.meta.url)

    let vitePwaClientPlugin: Plugin | undefined
    const resolveVitePluginPWAAPI = (): VitePluginPWAAPI | undefined => {
      return vitePwaClientPlugin?.api
    }

    nuxt.hook('vite:extend', ({ config }) => {
      const plugin = config.plugins?.find(p => p && typeof p === 'object' && 'name' in p && p.name === 'vite-plugin-pwa')
      if (plugin)
        throw new Error('Remove vite-plugin-pwa plugin from Vite Plugins entry in Nuxt config file!')
    })
    nuxt.hook('vite:extendConfig', (viteInlineConfig, { isClient }) => {
      viteInlineConfig.plugins = viteInlineConfig.plugins || []
      const plugin = viteInlineConfig.plugins.find(p => p && typeof p === 'object' && 'name' in p && p.name === 'vite-plugin-pwa')
      if (plugin)
        throw new Error('Remove vite-plugin-pwa plugin from Vite Plugins entry in Nuxt config file!')

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
      nuxt.hooks.hook('vite:serverCreated', (viteServer, { isClient }) => {
        if (isClient) {
          viteServer.middlewares.stack.push({
            route: webManifest,
            // @ts-expect-error just ignore
            handle: (_req, _res, next) => {
              next()
            },
          })
          viteServer.middlewares.stack.push({
            route: devSw,
            // @ts-expect-error just ignore
            handle: (_req, _res, next) => {
              next()
            },
          })
          if (!options.strategies || options.strategies === 'generateSW') {
            viteServer.middlewares.stack.push({
              route: workbox,
              // @ts-expect-error just ignore
              handle: (_req, _res, next) => {
                next()
              },
            })
          }
        }
      })
    }
    else if (!options.disable) {
      const { filename = 'sw.js', srcDir = 'public' } = options
      const swSrc = await resolvePath(joinURL(nuxt.options.rootDir, srcDir, filename))
      let useFilename = filename
      if (swSrc && options.strategies === 'injectManifest' && filename.endsWith('.ts'))
        useFilename = `${filename.substring(0, filename.lastIndexOf('.'))}.js`

      addServerHandler({
        route: `${nuxt.options.app.baseURL}${useFilename}`,
        handler: resolver.resolve('./runtime/sw.ts'),
        middleware: true,
        method: 'GET',
      })
      nuxt.hook('nitro:build:before', async (builder) => {
        builder.options.runtimeConfig.swDir = options.outDir as string
        builder.options.runtimeConfig.swName = useFilename
      })
    }
    nuxt.hook('close', async () => {
      if (nuxt.options.dev) {
        // todo: cleanup dev-dist folder
        // eslint-disable-next-line no-console
        console.log(resolver.resolve('dev-dist'))
      }
      else {
        await resolveVitePluginPWAAPI()?.generateSW()
      }
    })
  },
})
