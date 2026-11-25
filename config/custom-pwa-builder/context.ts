import type { Nuxt } from '@nuxt/schema'
import type { VitePWAStrategy } from '@unplugin-pwa/core'
import type { NuxtPWAModuleResolver } from '@vite-pwa/nuxt-core/shared-types'
import type { PwaOptions } from '@vite-pwa/nuxt-core/types'
import type { SWType } from '@vite-pwa/workbox-build/types'
import type { ViteLegacyNuxtPWAContext, ViteNuxtPWAContext } from './internal-types.ts'
import { createCustomVitePWAContext } from '@unplugin-pwa/vite/vite-context'
import { prepareNuxtOptions } from './prepare-nuxt-options'

export function createViteNuxtPwaContext<
  UserStrategy extends VitePWAStrategy,
  T extends SWType,
>(
  envApi: boolean,
  nuxtVersion: string,
  buildAssetsDir: string,
  options: PwaOptions<UserStrategy, T>,
  nuxt: Nuxt,
  moduleResolver: NuxtPWAModuleResolver,
): ViteNuxtPWAContext<UserStrategy, T> | ViteLegacyNuxtPWAContext<UserStrategy, T> {
  const {
    builder: _builder,
    experimental,
    registerWebManifestInRouteRules,
    writePlugin = false,
    client = {},
    ...pwaOptions
  } = options

  const ctx = Object.assign(
    createCustomVitePWAContext<UserStrategy, T, 'vite' | 'vite-legacy'>(
      envApi ? 'vite' : 'vite-legacy',
      envApi,
      pwaOptions,
    ),
    {
      nuxt: {
        prepareNuxtOptions: () => prepareNuxtOptions(ctx, nuxt),
        nuxtVersion,
        nitroPWAOptions: {
          routeRules: {},
        },
        buildAssetsDir,
        client: {
          registerPlugin: true,
          installPrompt: false,
          periodicSyncForUpdates: 0,
          ...client,
        },
        experimental,
        registerWebManifestInRouteRules,
        writePlugin,
        publicDirs: [],
        moduleResolver,
      },
    },
  ) as ViteNuxtPWAContext<UserStrategy, T> | ViteLegacyNuxtPWAContext<UserStrategy, T>

  return ctx
}
