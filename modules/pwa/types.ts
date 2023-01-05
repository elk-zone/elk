import type { VitePWAOptions } from 'vite-plugin-pwa'

export interface VitePWANuxtOptions extends Partial<VitePWAOptions> {}

declare module '@nuxt/schema' {
  interface NuxtConfig {
    pwa?: { [K in keyof VitePWANuxtOptions]?: Partial<VitePWANuxtOptions[K]> }
  }
  interface NuxtOptions {
    pwa: VitePWANuxtOptions
  }
}
