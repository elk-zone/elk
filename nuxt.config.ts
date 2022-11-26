import { isCI } from 'std-env'

export default defineNuxtConfig({
  ssr: false,
  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
    '@vue-macros/nuxt',
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
    define: {
      '__BUILD_TIME__': JSON.stringify(new Date().toISOString()),
      'process.env.VSCODE_TEXTMATE_DEBUG': 'false',
    },
    build: {
      target: 'esnext',
    },
  },
  nitro: {
    prerender: {
      crawlLinks: false,
      routes: ['/error'],
    },
  },
  routeRules: {
    '/error': { static: true, prerender: true },
  },
  postcss: {
    plugins: {
      'postcss-nested': {},
    },
  },
  runtimeConfig: {
    deployUrl: process.env.DEPLOY_URL,
    cloudflare: {
      accountId: '',
      namespaceId: '',
      apiToken: '',
    },
    public: {
      translateApi: '',
    },
  },
  pwa: {
    mode: isCI ? 'production' : 'development',
    // disabled on deploy until ui stable
    disable: isCI,
    scope: '/',
    srcDir: './service-worker',
    filename: 'sw.ts',
    strategies: 'injectManifest',
    injectRegister: false,
    includeManifestIcons: false,
    manifest: {
      scope: '/',
      id: '/',
      name: 'Elk',
      short_name: 'Elk',
      description: 'Elk',
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
        {
          src: 'logo.svg',
          sizes: '250x250',
          type: 'image/png',
          purpose: 'any maskable',
        },
      ],
    },
    injectManifest: {
      globPatterns: ['**/*.{js,json,css,html,txt,svg,png,ico,webp,woff,woff2,ttf,eot,otf,wasm}'],
    },
    devOptions: {
      enabled: true,
      type: 'module',
    },
  },
})
