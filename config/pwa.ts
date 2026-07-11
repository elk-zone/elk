import type { VitePWANuxtOptions } from '../modules/pwa/types'
import { isCI, isDevelopment } from 'std-env'

export const pwa: VitePWANuxtOptions = {
  mode: isCI ? 'production' : 'development',
  // disable PWA only when in preview mode
  disable: /* temporarily test in CI isPreview || */ (isDevelopment && process.env.VITE_DEV_PWA !== 'true'),
  scope: '/',
  srcDir: '../service-worker',
  filename: 'elk-sw.ts',
  strategies: 'injectManifest',
  injectRegister: false,
  includeManifestIcons: false,
  manifest: false,
  injectManifest: {
    // debug options
    // minify: false,
    // enableWorkboxModulesLogs: true,

    globPatterns: ['**/*.{js,json,css,html,txt,svg,png,ico,webp,woff,woff2,ttf,eot,otf,wasm}'],
    globIgnores: ['emojis/**', 'manifest**.webmanifest'],
  },
  devOptions: {
    enabled: process.env.VITE_DEV_PWA === 'true',
    type: 'module',
  },
}
