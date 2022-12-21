import { isCI, isDevelopment } from 'std-env'
import type { VitePWANuxtOptions } from '../modules/pwa/types'

const isPreview = process.env.PULL_REQUEST === 'true'

const pwa: VitePWANuxtOptions = {
  mode: isCI ? 'production' : 'development',
  // disable PWA only when in preview mode
  disable: isPreview || (isDevelopment && process.env.VITE_DEV_PWA !== 'true'),
  scope: '/',
  srcDir: './service-worker',
  filename: 'sw.ts',
  strategies: 'injectManifest',
  injectRegister: false,
  includeManifestIcons: false,
  manifest: {
    scope: '/',
    id: '/',
    name: `Elk${isCI ? isPreview ? ' (preview)' : '' : ' (dev)'}`,
    short_name: `Elk${isCI ? isPreview ? ' (preview)' : '' : ' (dev)'}`,
    description: `A nimble Mastodon Web Client${isCI ? isPreview ? ' (preview)' : '' : ' (development)'}`,
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
      /*
      {
        src: 'logo.svg',
        sizes: '250x250',
        type: 'image/png',
        purpose: 'any maskable',
      },
*/
    ],
  },
  injectManifest: {
    globPatterns: ['**/*.{js,json,css,html,txt,svg,png,ico,webp,woff,woff2,ttf,eot,otf,wasm}'],
  },
  devOptions: {
    enabled: process.env.VITE_DEV_PWA === 'true',
    type: 'module',
  },
}

export { pwa }
