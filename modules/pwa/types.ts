import type { VitePWAOptions } from 'vite-plugin-pwa'
import type { Overwrite } from '../../types/utils'

export type VitePWANuxtOptions = Overwrite<Partial<VitePWAOptions>, {
  i18n?: boolean
}>

declare module '@nuxt/schema' {
  interface NuxtConfig {
    pwa?: { [K in keyof VitePWANuxtOptions]?: Partial<VitePWANuxtOptions[K]> }
  }
  interface NuxtOptions {
    pwa: VitePWANuxtOptions
  }
}
