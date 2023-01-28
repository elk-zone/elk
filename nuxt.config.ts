import { createResolver } from '@nuxt/kit'
import Inspect from 'vite-plugin-inspect'
import { isCI, isDevelopment, isWindows } from 'std-env'
import { isPreview } from './config/env'
import { i18n } from './config/i18n'
import { pwa } from './config/pwa'
import type { BuildInfo } from './types'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  typescript: {
    tsConfig: {
      exclude: ['../service-worker'],
      vueCompilerOptions: {
        jsxTemplates: true,
        experimentalRfc436: true,
      },
    },
  },
  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
    '@vue-macros/nuxt',
    '@nuxtjs/i18n',
    '@nuxtjs/color-mode',
    ...(isDevelopment || isWindows) ? [] : ['nuxt-security'],
    '~/modules/purge-comments',
    '~/modules/setup-components',
    '~/modules/build-env',
    '~/modules/tauri/index',
    '~/modules/pwa/index', // change to '@vite-pwa/nuxt' once released and remove pwa module
    '~/modules/stale-dep',
    ['unplugin-vue-inspector/nuxt', {
      enabled: false,
      toggleButtonVisibility: 'never',
    }],
  ],
  experimental: {
    payloadExtraction: false,
    reactivityTransform: true,
    inlineSSRStyles: false,
  },
  css: [
    '@unocss/reset/tailwind.css',
    'floating-vue/dist/style.css',
    '~/styles/default-theme.css',
    '~/styles/vars.css',
    '~/styles/global.css',
    ...process.env.TAURI_PLATFORM === 'macos'
      ? []
      : ['~/styles/scrollbars.css'],
    '~/styles/tiptap.css',
    '~/styles/dropdown.css',
  ],
  alias: {
    'querystring': 'rollup-plugin-node-polyfills/polyfills/qs',
    'change-case': 'scule',
    'semver': resolve('./mocks/semver'),
  },
  imports: {
    dirs: [
      './composables/masto',
      './composables/push-notifications',
      './composables/settings',
      './composables/tiptap/index.ts',
    ],
  },
  vite: {
    define: {
      'process.env.VSCODE_TEXTMATE_DEBUG': 'false',
      'process.mock': ((!isCI || isPreview) && process.env.MOCK_USER) || 'false',
      'process.test': 'false',
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
    adminKey: '',
    cloudflare: {
      accountId: '',
      namespaceId: '',
      apiToken: '',
    },
    public: {
      privacyPolicyUrl: '',
      env: '', // set in build-env module
      buildInfo: {} as BuildInfo, // set in build-env module
      pwaEnabled: !isDevelopment || process.env.VITE_DEV_PWA === 'true',
      // We use LibreTranslate(https://github.com/LibreTranslate/LibreTranslate) as our default translation server #76
      translateApi: '',
      // Use the instance where Elk has its Mastodon account as the default
      defaultServer: 'm.webtoo.ls',
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
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
    prerender: {
      crawlLinks: true,
      routes: ['/'],
      ignore: ['/settings'],
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
        { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
      meta: [
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        // open graph social image
        { property: 'og:title', content: 'Elk' },
        { property: 'og:description', content: 'A nimble Mastodon web client' },
        { property: 'og:type', content: 'website' },
        { property: 'og:image', content: 'https://elk.zone/elk-og.png' },
        { property: 'og:image:width', content: '3800' },
        { property: 'og:image:height', content: '1900' },
        { property: 'og:site_name', content: 'Elk' },
        { property: 'twitter:site', content: '@elk_zone' },
        { property: 'twitter:card', content: 'summary_large_image' },
      ],
    },
  },
  // eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
  // @ts-ignore nuxt-security is conditional
  security: {
    headers: {
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        value: {
          'default-src': ['\'self\''],
          'base-uri': ['\'self\''],
          'connect-src': ['\'self\'', 'https:', 'http:', 'wss:', 'ws:'],
          'font-src': ['\'self\''],
          'form-action': ['\'none\''],
          'frame-ancestors': ['\'none\''],
          'img-src': ['\'self\'', 'https:', 'http:', 'data:'],
          'media-src': ['\'self\'', 'https:', 'http:'],
          'object-src': ['\'none\''],
          'script-src': ['\'self\'', '\'unsafe-inline\'', '\'wasm-unsafe-eval\''],
          'script-src-attr': ['\'none\''],
          'style-src': ['\'self\'', '\'unsafe-inline\''],
          'upgrade-insecure-requests': true,
        },
        route: '/**',
      },
    },
    rateLimiter: false,
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
