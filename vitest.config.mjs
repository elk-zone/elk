import { defineVitestConfig } from 'nuxt-vitest/config'

export default defineVitestConfig({
  define: {
    'process.test': 'true',
  },
})
