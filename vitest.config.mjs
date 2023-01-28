import { defineConfigWithNuxtEnv } from 'vitest-environment-nuxt/config'

export default defineConfigWithNuxtEnv({
  define: {
    'process.test': 'true',
  },
})
