import { fileURLToPath } from 'node:url'
import Inspect from 'vite-plugin-inspect'
import { isCI, isDevelopment } from 'std-env'
import { i18n } from './config/i18n'
import { pwa } from './config/pwa'

const isPreview = process.env.PULL_REQUEST === 'true'

export default defineNuxtConfig({
  typescript: {
    tsConfig: {
      exclude: ['../service-worker'],
    },
  },
  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
    '@vue-macros/nuxt',
    '@nuxtjs/i18n',
    '~/modules/purge-comments',
    '~/modules/setup-components',
    '~/modules/pwa/index', // change to '@vite-pwa/nuxt' once released and remove pwa module
  ],
  experimental: {
    reactivityTransform: true,
    inlineSSRStyles: false,
  },
  css: [
    '@unocss/reset/tailwind.css',
    'floating-vue/dist/style.css',
    '~/styles/vars.css',
    '~/styles/global.css',
    '~/styles/tiptap.css',
    '~/styles/dropdown.css',
  ],
  alias: {
    querystring: 'rollup-plugin-node-polyfills/polyfills/qs',
  },
  vite: {
    // to make use of `TAURI_PLATFORM`, `TAURI_ARCH`, `TAURI_FAMILY`,
    // `TAURI_PLATFORM_VERSION`, `TAURI_PLATFORM_TYPE` and `TAURI_DEBUG`
    // env variables
    envPrefix: ['VITE_', 'TAURI_'],
    define: {
      'import.meta.env.__BUILD_TIME__': JSON.stringify(new Date().toISOString()),
      'import.meta.env.__BUILD_COMMIT__': JSON.stringify(process.env.COMMIT_REF || ''),
      'process.env.VSCODE_TEXTMATE_DEBUG': 'false',
      'process.mock': ((!isCI || isPreview) && process.env.MOCK_USER) || 'false',
    },
    build: {
      target: process.env.TAURI_PLATFORM ? ['es2021', 'chrome100', 'safari13'] : 'esnext',
    },
    plugins: [
      Inspect(),
    ],
  },
  postcss: {
    plugins: {
      'postcss-nested': {},
    },
  },
  runtimeConfig: {
    deployUrl: !isCI
      ? 'http://localhost:5314'
      : isPreview
        ? process.env.DEPLOY_PRIME_URL
        : 'https://elk.zone',
    cloudflare: {
      accountId: '',
      namespaceId: '',
      apiToken: '',
    },
    public: {
      env: isCI ? isPreview ? 'staging' : 'production' : 'local',
      pwaEnabled: !isDevelopment || process.env.VITE_DEV_PWA === 'true',
      translateApi: '',
      // Masto uses Mastodon version checks to see what features are enabled.
      // Mastodon alternatives like GoToSocial will always fail these checks, so
      // provide a way to disable them.
      disableVersionCheck: false,
    },
    storage: {
      driver: isCI ? 'cloudflare' : 'fs',
      fsBase: 'node_modules/.cache/servers',
    },
  },
  routeRules: {
    '/manifest.webmanifest': {
      headers: {
        'Content-Type': 'application/manifest+json',
      },
    },
  },
  nitro: {
    publicAssets: [
      ...(!isCI || isPreview ? [{ dir: fileURLToPath(new URL('./public-dev', import.meta.url)) }] : []),
    ],
    prerender: {
      crawlLinks: false,
      routes: ['/', '/200.html'],
    },
  },
  app: {
    keepalive: true,
    head: {
      // Prevent arbitrary zooming on mobile devices
      viewport: 'width=device-width,initial-scale=1,maximum-scale=1,user-scalable=0,viewport-fit=cover',
      bodyAttrs: {
        class: 'overflow-x-hidden',
      },
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'alternate icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', href: '/favicon-16x16.png', sizes: '16x16' },
        { rel: 'icon', type: 'image/png', href: '/favicon-32x32.png', sizes: '32x32' },
        { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#ffffff' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' },
      ],
      meta: [{ name: 'theme-color', content: '#ffffff' }],
    },
  },
  i18n,
  pwa,
})

declare global {
  namespace NodeJS {
    interface Process {
      mock?: Record<string, any>
    }
  }
}
