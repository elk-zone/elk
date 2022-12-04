import { isCI } from 'std-env'
import type { VitePWANuxtOptions } from './pwa/types'

const suffix = isCI ? '' : '-dev'
const pwa: VitePWANuxtOptions = {
  mode: isCI ? 'production' : 'development',
  // disabled on deploy and local dev/build until ui stable
  disable: isCI || !(process.env.DEV_PWA === 'true'),
  scope: '/',
  srcDir: './service-worker',
  filename: 'sw.ts',
  strategies: 'injectManifest',
  injectRegister: false,
  includeManifestIcons: false,
  manifest: {
    scope: '/',
    id: '/',
    name: `Elk${isCI ? '' : ' (dev)'}`,
    short_name: `Elk${isCI ? '' : ' (dev)'}`,
    description: `A nimble Mastodon Web Client${isCI ? '' : ' (development)'}`,
    theme_color: '#ffffff',
    icons: [
      {
        src: `pwa-192x192${suffix}.png`,
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: `pwa-512x512${suffix}.png`,
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: `logo${suffix}.svg`,
        sizes: '250x250',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
  },
  injectManifest: {
    globPatterns: ['**/*.{js,json,css,html,txt,svg,png,ico,webp,woff,woff2,ttf,eot,otf,wasm}'],
    globIgnores: isCI
      ? ['**/*-dev.{svg,png,ico}']
      : [
          'apple-touch-icon.png',
          'favicon.ico',
          'favicon.svg',
          'favicon-16x16.png',
          'favicon-32x32.png',
          'logo.svg',
          'pwa-192x192.png',
          'pwa-512x512.png',
        ],
  },
  devOptions: {
    enabled: process.env.DEV_PWA === 'true',
    type: 'module',
  },
}

export { pwa }
