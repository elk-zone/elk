import antfu from '@antfu/eslint-config'

export default await antfu({
  formatters: {
    css: false,
    html: false,
    markdown: false,
  },
  unocss: false,
  json: {
    files: ['locales/**.json'],
    rules: {
      'jsonc/sort-keys': 'error',
    },
  },
  vue: {
    rules: {
      'vue/no-restricted-syntax': ['error', {
        selector: 'VElement[name=\'a\']',
        message: 'Use NuxtLink instead.',
      }],
      'n/prefer-global/process': 'off',
    },
  },
  ignores: [
    '!pages/public',
    '**/*.css',
    '**/*.png',
    '**/*.ico',
    '**/*.toml',
    '**/*.patch',
    '**/*.txt',
    '**/Dockerfile',
    'public/',
    'public-dev/',
    'public-staging/',
    'https-dev-config/localhost.crt',
    'https-dev-config/localhost.key',
    'elk-translation-status.json',
    'docs/translation-status.json',
  ],
}, {
  rules: {
    'node/prefer-global/process': 'off',
  },
})
