export default defineNuxtConfig({
  extends: '@nuxt-themes/docus',
  vite: {
    optimizeDeps: {
      include: ['scule'],
    },
  },
})
