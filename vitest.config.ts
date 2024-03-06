import { defineVitestConfig } from '@nuxt/test-utils/config'
import { isCI } from 'std-env'

export default defineVitestConfig({
  define: {
    'process.test': 'true',
  },
  test: {
    reporters: isCI ? ['default', 'hanging-process'] : ['default'],
    setupFiles: [
      '/tests/setup.ts',
    ],
    environmentOptions: {
      nuxt: {
        mock: {
          indexedDb: true,
          intersectionObserver: true,
        },
      },
    },
  },
})
