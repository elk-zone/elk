import type { PwaOptions } from '@vite-pwa/nuxt-core/types'
import { isCI, isDevelopment } from 'std-env'
import { STORAGE_KEY_PWA_HIDE_INSTALL } from '../app/constants'
import { builder } from './custom-pwa-builder'

const pwaDisabled = /* temporarily test in CI isPreview || */ (isDevelopment && process.env.VITE_DEV_PWA !== 'true')

export const pwaEnabled = !pwaDisabled

export const pwa: Partial<PwaOptions<'buildSW', 'classic'>> = {
  // disable PWA only when in preview mode
  disable: /* temporarily test in CI isPreview || */ pwaDisabled,
  scope: '/',
  filename: 'elk-sw.js',
  strategies: 'buildSW',
  injectRegister: false,
  includeManifestIcons: false,
  manifest: false,
  builder,
  minify: isCI || !isDevelopment,
  client: {
    installPrompt: STORAGE_KEY_PWA_HIDE_INSTALL,
  },
  buildSW: {
    // debug options
    // minify: false,
    // enableWorkboxModulesLogs: true,
    mode: isCI ? 'production' : 'development',
    sourcemap: !isCI && isDevelopment,
    enableSWKitLogs: !isCI && isDevelopment,
    swSrc: '~~/service-worker/elk-sw.ts',
    globPatterns: ['**/*.{js,json,css,html,txt,svg,png,ico,webp,woff,woff2,ttf,eot,otf,wasm}'],
    globIgnores: ['emojis/**', 'manifest**.webmanifest', 'sw.js'],
    // split workbox runtime on its own chunk
    inlineWorkboxRuntime: false,
    customChunks: (moduleId: string) => {
      if (
        moduleId.endsWith('web-push-notifications.ts')
        || moduleId.endsWith('notification.ts')
        || moduleId.endsWith('elk-idb.ts')
        || moduleId.includes('idb-keyval')
        || (moduleId.includes('constants') && moduleId.endsWith('index.ts'))
      ) {
        return 'elk-push-notifications'
      }
      if (moduleId.endsWith('share-target.ts')) {
        return 'elk-share-target'
      }
    },
  },
  devOptions: {
    enabled: process.env.VITE_DEV_PWA === 'true',
    type: 'classic',
  },
}
