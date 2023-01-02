import { createResolver } from '@nuxt/kit'
import Inspect from 'vite-plugin-inspect'
import { isCI, isDevelopment } from 'std-env'
import { i18n } from './config/i18n'
import { pwa } from './config/pwa'

const { resolve } = createResolver(import.meta.url)
const isPreview = process.env.PULL_REQUEST === 'true' || process.env.CONTEXT === 'deploy-preview' || process.env.CONTEXT === 'dev'

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
    '@nuxtjs/color-mode',
    '~/modules/purge-comments',
    '~/modules/setup-components',
    '~/modules/build-info',
    '~/modules/pwa/index', // change to '@vite-pwa/nuxt' once released and remove pwa module
    '~/modules/tauri/index',
  ],
  experimental: {
    payloadExtraction: false,
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
    'querystring': 'rollup-plugin-node-polyfills/polyfills/qs',
    'masto/fetch': 'masto/fetch',
    'masto': 'masto/fetch',
    'change-case': 'scule',
    'semver': 'unenv/runtime/mock/empty',
  },
  imports: {
    dirs: [
      './composables/push-notifications',
      './composables/tiptap',
    ],
  },
  vite: {
    define: {
      'process.env.VSCODE_TEXTMATE_DEBUG': 'false',
      'process.mock': ((!isCI || isPreview) && process.env.MOCK_USER) || 'false',
    },
    build: {
      target: 'esnext',
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
    discord: {
      inviteUrl: 'https://chat.elk.zone',
    },
    github: {
      // oauth flow
      clientId: '',
      clientSecret: '',
      inviteToken: '',
    },
    public: {
      env: isCI ? isPreview ? 'staging' : 'production' : 'local',
      pwaEnabled: !isDevelopment || process.env.VITE_DEV_PWA === 'true',
      translateApi: '',
    },
    storage: {
      driver: isCI ? 'cloudflare' : 'fs',
      fsBase: 'node_modules/.cache/servers',
    },
  },
  routeRules: {
    '/api/list-servers': { swr: true },
    '/manifest.webmanifest': {
      headers: {
        'Content-Type': 'application/manifest+json',
      },
    },
  },
  nitro: {
    publicAssets: [
      ...(!isCI || isPreview ? [{ dir: resolve('./public-dev') }] : []),
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
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
      meta: [
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      ],
    },
  },
  colorMode: { classSuffix: '' },
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
