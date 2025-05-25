import { addVitePlugin, defineNuxtModule } from '@nuxt/kit'
import MagicString from 'magic-string'

export default defineNuxtModule({
  meta: {
    name: 'purge-comments',
  },
  setup() {
    addVitePlugin({
      name: 'purge-comments',
      enforce: 'pre',
      transform: (code, id) => {
        if (!id.endsWith('.vue') || !code.includes('<!--'))
          return

        const s = new MagicString(code)
        s.replace(/<!--.*?-->/gs, '')

        if (s.hasChanged()) {
          return {
            code: s.toString(),
            map: s.generateMap({ source: id, includeContent: true }),
          }
        }
      },
    })
  },
})
