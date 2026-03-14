import { defineConfig } from 'vite-plus'

export default defineConfig({
  fmt: {
    semi: false,
    singleQuote: true,
    ignorePatterns: ['node_modules', '.nuxt'],
  },
})
