import MagicString from 'magic-string'
import { addVitePlugin, defineNuxtModule } from 'nuxt/kit'

const MAGIC_STRING_RE = /<!--.*?-->/gs

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
        s.replace(MAGIC_STRING_RE, '')

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
