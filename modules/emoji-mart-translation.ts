import { lstat } from 'node:fs'
import { createResolver, defineNuxtModule } from '@nuxt/kit'
import { currentLocales } from '../config/i18n'

const virtual = 'virtual:emoji-mart-lang-importer'
const resolvedVirtual = `\0${virtual}.mjs`

export default defineNuxtModule({
  meta: {
    name: 'emoji-mark-translation',
  },
  setup(_, nuxt) {
    const resolver = createResolver(import.meta.url)
    nuxt.hook('vite:extendConfig', async (viteInlineConfig) => {
      viteInlineConfig.plugins = viteInlineConfig.plugins || []
      viteInlineConfig.plugins.push({
        name: 'vite-emoji-mart-translation',
        enforce: 'pre',
        resolveId(id) {
          if (id === virtual)
            return resolvedVirtual
        },
        async load(id) {
          if (id === resolvedVirtual) {
            const locales = await Promise.all(
              Array
                .from(new Set((currentLocales).map(l => l.code.split('-')[0])))
                .map(async (l) => {
                  const exists = await isFile(resolver.resolve(`../node_modules/@emoji-mart/data/i18n/${l}.json`))
                  return [l, exists] as [code: string, exists: boolean]
                }),
            )
              .then(l => l.filter(l => l[1]).map(l => l[0]))
            const switchStmt = locales.filter(l => l[1]).map((l) => {
              return `
    case "${l}":
      return import("@emoji-mart/data/i18n/${l}.json").catch(() => {});`
            })
            return `export default function(lang) {
  switch(lang) {
    ${switchStmt.join('')}
    default:
      return import("@emoji-mart/data/i18n/en.json").catch(() => {});
  }
}  
`
          }
        },
      })
    })
  },
})

async function isFile(path: string) {
  return new Promise<boolean>((resolve) => {
    lstat(path, (err, stats) => {
      if (err)
        resolve(false)
      else
        resolve(stats.isFile())
    })
  })
}
