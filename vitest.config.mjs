import { defineVitestConfig } from 'nuxt-vitest'

export default defineVitestConfig({
  define: {
    'process.test': 'true',
  },
})
