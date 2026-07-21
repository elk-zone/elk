// @ts-check
import antfu from '@antfu/eslint-config'

export default await antfu(
  {
    unocss: false,
    vue: {
      overrides: {
        'vue/no-restricted-syntax': ['error', {
          selector: 'VElement[name=\'a\']',
          message: 'Use NuxtLink instead.',
        }],
      },
    },
    ignores: [
      'public/**',
      'public-dev/**',
      'public-staging/**',
      'https-dev-config/**',
      'elk-translation-status.json',
      'docs/translation-status.json',
    ],
  },
  {
    rules: {
      // TODO: migrate all process reference to `import.meta.env` and remove this rule
      'node/prefer-global/process': 'off',
    },
  },
  {
    files: ['docs/content/**/*.md'],
    rules: {
      // the markdown plugin misreads `#slot` as a malformed heading
      // MDC components (https://content.nuxt.com/docs/files/markdown#vue-components)
      // use this `#slot` syntax
      'markdown/no-missing-atx-heading-space': 'off',
    },
  },
  // Sort local files
  {
    files: ['locales/**.json'],
    rules: {
      'jsonc/sort-keys': 'error',
    },
  },
)
