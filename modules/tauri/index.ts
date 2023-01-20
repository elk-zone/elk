import { rm } from 'fs/promises'
import { addImports, addPlugin, createResolver, defineNuxtModule, useNuxt } from '@nuxt/kit'

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

    nuxt.options.sourcemap.client = false

    nuxt.options.alias = {
      ...nuxt.options.alias,
      'unstorage/drivers/fs': 'unenv/runtime/mock/proxy',
      'unstorage/drivers/cloudflare-kv-http': 'unenv/runtime/mock/proxy',
      'node:events': 'unenv/runtime/node/events/index',
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

    addImports({ name: 'useStorage', from: resolve('./runtime/storage') })

    addPlugin(resolve('./runtime/logging.client'))
    addPlugin(resolve('./runtime/nitro.client'))

    // cleanup files copied from the public folder that we don't need
    nuxt.hook('close', async () => {
      await rm('.output/public/_redirects')
    })
  },
})
