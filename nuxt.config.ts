export default defineNuxtConfig({
  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
  ],
  experimental: {
    reactivityTransform: true,
    inlineSSRStyles: false,
  },
  css: [
    '@unocss/reset/tailwind.css',
    '~/styles/vars.css',
    '~/styles/global.css',
  ],
  colorMode: {
    classSuffix: '',
  },
  alias: {
    querystring: 'rollup-plugin-node-polyfills/polyfills/qs',
  },
  postcss: {
    plugins: {
      'postcss-nested': {},
    },
  },
  runtimeConfig: {
    registedAppsUrl: process.env.APPS_JSON_URL || 'http://localhost:3000/registered-apps.json',
  },
})
