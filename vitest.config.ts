import { defineVitestProject } from '@nuxt/test-utils/config'
import { isCI } from 'std-env'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  define: {
    'process.test': 'true',
  },
  test: {
    reporters: isCI ? ['default', 'hanging-process'] : ['default'],
    exclude: ['../tests/e2e/**'],
    projects: [
      await defineVitestProject({
        test: {
          name: 'nuxt',
          setupFiles: [
            '../tests/setup.ts',
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
      }),
    ],
  },
})
