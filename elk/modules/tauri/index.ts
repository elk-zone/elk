import { rm } from 'node:fs/promises'
import { addImports, addImportsSources, addPlugin, createResolver, defineNuxtModule, useNuxt } from '@nuxt/kit'
import { resolveModulePath } from 'exsolve'

const mockProxy = resolveModulePath('mocked-exports/proxy', { from: import.meta.url })

export default defineNuxtModule({
  meta: {
    name: 'tauri',
  },
  setup() {
    const nuxt = useNuxt()
    const { resolve } = createResolver(import.meta.url)

    if (!process.env.TAURI_PLATFORM)
      return

    if (nuxt.options.dev)
      nuxt.options.ssr = false

    nuxt.options.pwa.disable = true
    nuxt.options.sourcemap.client = false

    nuxt.options.alias = {
      ...nuxt.options.alias,
      'unstorage/drivers/fs': mockProxy,
      'unstorage/drivers/cloudflare-kv-http': mockProxy,
      '#storage-config': resolve('./runtime/storage-config'),
      'node:events': 'unenv/runtime/node/events/index',
      '#build-info': resolve('./runtime/build-info'),
    }

    nuxt.hook('vite:extend', ({ config }) => {
      config.build!.target = ['chrome100', 'safari15']
      config.envPrefix = [...config.envPrefix || [], 'VITE_', 'TAURI_']
    })

    // prevent creation of server routes
    nuxt.hook('nitro:config', (config) => {
      config.srcDir = './_nonexistent'
      config.scanDirs = []
    })

    addImportsSources({
      from: 'h3',
      imports: ['defineEventHandler', 'getQuery', 'getRouterParams', 'readBody', 'sendRedirect'] as Array<keyof typeof import('h3')>,
    })

    nuxt.options.imports.dirs = nuxt.options.imports.dirs || []
    nuxt.options.imports.dirs.push(resolve('../../server/utils'))

    addImports({ name: 'useStorage', from: resolve('./runtime/storage') })

    addPlugin(resolve('./runtime/logging.client'))
    addPlugin(resolve('./runtime/nitro.client'))

    // cleanup files copied from the public folder that we don't need
    nuxt.hook('close', async () => {
      await rm('.output/public/_redirects')
      await rm('.output/public/apple-touch-icon.png')
      await rm('.output/public/elk-og.png')
      await rm('.output/public/favicon.ico')
      await rm('.output/public/pwa-192x192.png')
      await rm('.output/public/pwa-512x512.png')
      await rm('.output/public/robots.txt')
    })
  },
})
