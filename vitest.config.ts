import { resolve } from 'path'
import { defineConfig } from 'vitest/config'
import Vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${resolve(__dirname)}/`,
    },
  },
  define: {
    'process.server': 'false',
    'process.client': 'true',
  },
  plugins: [
    Vue({
      reactivityTransform: true,
    }),
    AutoImport({
      dts: false,
      imports: [
        'vue',
        '@vueuse/core',
      ],
      dirs: [
        'composables',
      ],
    }),
  ],
})
