import { addPlugin, createResolver, defineNuxtModule, useNuxt } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'tauri',
  },
  setup() {
    const nuxt = useNuxt()
    const { resolve } = createResolver(import.meta.url)

    if (!process.env.TAURI_PLATFORM)
      return

    nuxt.hook('vite:extend', ({ config }) => {
      config.build!.target = ['es2021', 'chrome100', 'safari13']
      config.envPrefix = [...config.envPrefix || [], 'VITE_', 'TAURI_']
    })

    addPlugin(resolve('./runtime/logging.client'))
  },
})
