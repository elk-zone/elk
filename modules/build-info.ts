import { addVitePlugin, defineNuxtModule } from '@nuxt/kit'
import { getEnv, version } from '../config/env'
import type { BuildInfo } from '~/types'

export default defineNuxtModule({
  meta: {
    name: 'elk:build-info',
  },
  async setup(_options, nuxt) {
    const { env, commit, branch } = await getEnv()
    nuxt.options.runtimeConfig.public.env = env

    const buildInfo: BuildInfo = {
      version,
      time: +Date.now(),
      commit,
      branch,
      env,
    }

    addVitePlugin({
      name: 'elk:build-info',
      resolveId(id) {
        if (id === 'virtual:build-info')
          return id
      },
      load(id) {
        if (id === 'virtual:build-info')
          return `export const buildInfo = ${JSON.stringify(buildInfo, null, 2)}`
      },
    })
  },
})
