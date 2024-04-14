import { addVitePlugin, defineNuxtModule } from '@nuxt/kit'
import { currentLocales } from '../config/i18n'

const virtualName = 'virtual:iso-639-1'
const resolvedVirtualName = `\0${virtualName}`

export default defineNuxtModule({
  setup() {
    addVitePlugin({
      name: 'elk:iso-639-1',
      enforce: 'pre',
      resolveId(id) {
        return id === virtualName ? resolvedVirtualName : null
      },
      async load(id) {
        if (id === resolvedVirtualName) {
          return `const languagesNames = ${JSON.stringify(currentLocales.reduce((acc, l) => {
              acc[l.code] = l.name as string
              return acc
          }, {} as Record<string, string>))};
export const supportedTranslationLanguages = Object.entries(languagesNames).map(([code, nativeName]) => ({ code, nativeName }));          
export function getDisplayName(code) {
  return languagesNames[code] ?? new Intl.DisplayNames([code], { type: 'language' }).of(code);  
}
`
        }
      },
    })
  },
})
