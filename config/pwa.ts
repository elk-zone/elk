import { isCI, isDevelopment } from 'std-env'
import type { VitePWANuxtOptions } from '../modules/pwa/types'

export const pwa: VitePWANuxtOptions = {
  mode: isCI ? 'production' : 'development',
  // disable PWA only when in preview mode
  disable: /* temporarily test in CI isPreview || */ (isDevelopment && process.env.VITE_DEV_PWA !== 'true'),
  scope: '/',
  srcDir: './service-worker',
  filename: 'sw.ts',
  strategies: 'injectManifest',
  injectRegister: false,
  includeManifestIcons: false,
  // changing to false will need a change on setup.ts
  i18n: true,
  manifest: {
    scope: '/',
    id: '/',
    theme_color: '#ffffff',
    icons: [
      {
        src: 'pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  },
  injectManifest: {
    globPatterns: ['**/*.{js,json,css,html,txt,svg,png,ico,webp,woff,woff2,ttf,eot,otf,wasm}'],
    globIgnores: ['emojis/**'],
  },
  devOptions: {
    enabled: process.env.VITE_DEV_PWA === 'true',
    type: 'module',
  },
}
