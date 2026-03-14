import { defineVitestProject } from '@nuxt/test-utils/config'
import { isCI } from 'std-env'
import { defineConfig } from 'vite-plus'

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
            './tests/setup.ts',
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
