import { defineConfigWithNuxt } from 'nuxt-vitest/config'

export default defineConfigWithNuxt({
  define: {
    'process.test': 'true',
  },
})
