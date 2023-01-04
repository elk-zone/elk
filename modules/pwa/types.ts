import type { ManifestOptions, VitePWAOptions } from 'vite-plugin-pwa'
import type { Overwrite } from '../../types/utils'

export type VitePWANuxtOptions = Overwrite<Partial<VitePWAOptions>, {
  manifest?: () => Promise<Partial<ManifestOptions>>
}>

declare module '@nuxt/schema' {
  interface NuxtConfig {
    pwa?: { [K in keyof VitePWANuxtOptions]?: Partial<VitePWANuxtOptions[K]> }
  }
  interface NuxtOptions {
    pwa: VitePWANuxtOptions
  }
}
