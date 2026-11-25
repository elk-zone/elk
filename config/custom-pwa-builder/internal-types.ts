import type { VitePWAStrategy } from '@unplugin-pwa/core'
import type { VitePWAPluginContext } from '@unplugin-pwa/vite/vite-context'
import type { NuxtPWAContext } from '@vite-pwa/nuxt-core/context-types'
import type { SWType } from '@vite-pwa/workbox-build/types'

export type ViteNuxtPWAContext<
  UserStrategy extends VitePWAStrategy,
  T extends SWType,
> = VitePWAPluginContext<
  'vite',
  UserStrategy,
  T
> & NuxtPWAContext<
  'vite',
  UserStrategy,
  T
>

export type ViteLegacyNuxtPWAContext<
  UserStrategy extends VitePWAStrategy,
  T extends SWType,
> = VitePWAPluginContext<
  'vite-legacy',
  UserStrategy,
  T
> & NuxtPWAContext<
  'vite-legacy',
  UserStrategy,
  T
>
