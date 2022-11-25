import { resolve } from 'path'
import { defineConfig } from 'vitest/config'
import Vue from '@vitejs/plugin-vue'

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${resolve(__dirname)}/`,
    },
  },
  plugins: [
    Vue(),
  ],
})
