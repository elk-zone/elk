export default defineNuxtConfig({
  extends: '@nuxt-themes/docus',

  vite: {
    optimizeDeps: {
      include: ['scule'],
    },
  },

  compatibilityDate: '2024-11-07',
})
