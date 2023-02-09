export default defineNuxtConfig({
  app: {
    baseURL: '/docs',
  },
  extends: '@nuxt-themes/docus',
  typescript: {
    tsConfig: {
      resolveJsonModule: true,
    },
  },
})
