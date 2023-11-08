import type { VitePWAOptions } from 'vite-plugin-pwa'
import { type Ref, type UnwrapNestedRefs } from 'vue'

export interface VitePWANuxtOptions extends Partial<VitePWAOptions> {}

export interface PwaInjection {
  isInstalled: boolean
  showInstallPrompt: Ref<boolean>
  cancelInstall: () => void
  install: () => Promise<void>
  swActivated: Ref<boolean>
  registrationError: Ref<boolean>
  needRefresh: Ref<boolean>
  updateServiceWorker: (reloadPage?: boolean | undefined) => Promise<void>
  close: () => Promise<void>
}

declare module '#app/nuxt' {
  interface NuxtApp {
    $pwa: UnwrapNestedRefs<PwaInjection>
  }
}

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $pwa: UnwrapNestedRefs<PwaInjection>
  }
}

declare module '@nuxt/schema' {
  interface NuxtConfig {
    pwa?: { [K in keyof VitePWANuxtOptions]?: Partial<VitePWANuxtOptions[K]> }
  }
  interface NuxtOptions {
    pwa: VitePWANuxtOptions
  }
}
