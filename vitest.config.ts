import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  define: {
    'process.test': 'true',
  },
  test: {
    setupFiles: [
      '/tests/setup.ts',
    ],
  },
})
