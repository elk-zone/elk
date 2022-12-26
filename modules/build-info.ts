import { addVitePlugin, defineNuxtModule } from '@nuxt/kit'
import Git from 'simple-git'
import { version } from '../package.json'
import type { BuildInfo } from '~/types'

export default defineNuxtModule({
  meta: {
    name: 'elk:build-info',
  },
  async setup() {
    const git = Git()
    const buildInfo: BuildInfo = {
      version,
      time: +Date.now(),
      commit: await git.revparse(['HEAD']),
      branch: await git.revparse(['--abbrev-ref', 'HEAD']),
    }
    addVitePlugin({
      name: 'elk:build-info',
      resolveId(id) {
        if (id === 'virtual:build-info')
          return id
      },
      load(id) {
        if (id === 'virtual:build-info')
          return `export default ${JSON.stringify(buildInfo, null, 2)}`
      },
    })
  },
})
