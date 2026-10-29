import { defineVitestProject } from '@nuxt/test-utils/config'
import { isCI } from 'std-env'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  define: {
    'process.test': 'true',
  },
  test: {
    reporters: isCI ? ['default', 'hanging-process'] : ['default'],
    projects: [
      await defineVitestProject({
        test: {
          name: 'nuxt',
          setupFiles: [
            '../tests/setup.ts',
          ],
          environmentOptions: {
            nuxt: {
              // Avoid the root route's deferred auth redirect loading timelines during teardown.
              url: 'http://localhost:3000/settings',
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
