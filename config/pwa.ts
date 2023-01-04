import { isCI, isDevelopment } from 'std-env'
import type { VitePWANuxtOptions } from '../modules/pwa/types'
import { APP_NAME } from '../constants'
import { getEnv } from './env'

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
  manifest: async () => {
    const { env } = await getEnv()
    const envName = `${env !== 'release' ? '' : ` (${env})`}`
    return {
      scope: '/',
      id: '/',
      name: `${APP_NAME}${envName}`,
      short_name: `${APP_NAME}${envName}`,
      description: `A nimble Mastodon Web Client${envName}`,
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
    }
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
