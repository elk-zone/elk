import type { PwaModuleOptions } from '@vite-pwa/nuxt'
import { isCI, isDevelopment } from 'std-env'

export const pwa: PwaModuleOptions = {
  mode: isCI ? 'production' : 'development',
  // disable PWA only when in preview mode
  disable: /* temporarily test in CI isPreview || */ (isDevelopment && process.env.VITE_DEV_PWA !== 'true'),
  scope: '/',
  srcDir: '../service-worker',
  filename: 'elk-sw.ts',
  strategies: 'injectManifest',
  injectRegister: false,
  includeManifestIcons: false,
  manifest: {
    dir: 'ltr',
    lang: 'en_US',
    scope: '/',
    id: '/',
    start_url: '/',
    orientation: 'natural',
    display: 'standalone',
    display_override: ['window-controls-overlay'],
    categories: ['social', 'social networking', 'news'],
    icons: [
      {
        src: 'pwa-64x64.png',
        sizes: '64x64',
        type: 'image/png',
      },
      {
        src: 'pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: 'maskable-icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    share_target: {
      action: '/web-share-target',
      method: 'POST',
      enctype: 'multipart/form-data',
      params: {
        title: 'title',
        text: 'text',
        url: 'url',
        files: [
          {
            name: 'files',
            accept: ['image/*', 'video/*'],
          },
        ],
      },
    },
    handle_links: 'preferred',
    launch_handler: {
      client_mode: ['navigate-existing', 'auto'],
    },
    edge_side_panel: {
      preferred_width: 480,
    },
  },
  injectManifest: {
    globPatterns: ['**/*.{js,json,css,html,txt,svg,png,ico,webp,woff,woff2,ttf,eot,otf,wasm}'],
    globIgnores: ['emojis/**', 'manifest**.webmanifest'],
  },
  devOptions: {
    enabled: process.env.VITE_DEV_PWA === 'true',
    type: 'module',
  },
}
