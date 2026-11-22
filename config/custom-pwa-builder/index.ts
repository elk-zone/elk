import type { NuxtPWAContextBuilder } from '@vite-pwa/nuxt-core/types'
import { getMajor } from 'verkit'

export const builder: NuxtPWAContextBuilder = {
  build: async (
    nuxtVersion,
    buildAssetsDir,
    options,
    nuxt,
    moduleResolver,
  ) => {
    const major = getMajor(nuxtVersion)
    const envApi = major >= 5 || (major === 4 && !!nuxt.options.experimental.viteEnvironmentApi)
    const { createViteNuxtPwaContext } = await import('./context')
    return createViteNuxtPwaContext(
      envApi,
      nuxtVersion,
      buildAssetsDir,
      options,
      nuxt,
      moduleResolver,
    ) as any
  },
}
