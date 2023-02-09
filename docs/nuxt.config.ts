import { readFile } from 'fs-extra'
import { createResolver } from '@nuxt/kit'
import { flatten } from 'flat'
import vsCodeConfig from '../.vscode/settings.json'
import { localeData } from '../config/i18n'

interface LocaleEntry {
  title: string
  translated: string[]
  missing: string[]
  outdated: string[]
  total: number
  isSource?: boolean
}

export default defineNuxtConfig({
  app: {
    baseURL: '/docs',
  },
  extends: '@nuxt-themes/docus',
  vite: {
    /*
    plugins: [
    virtual({
       'virtual:elk-locales': {
         en: {
           translated: [
             'a11y.mykey',
           ],
           missing: [
             'a11y.myOtherKey',
           ],
           outdated: [
             'a11y.notExistFromSource',
           ],
           total: 2,
         },
       },
     }),
   ],
  */
    plugins: [{
      name: 'elk-locales',
      enforce: 'pre',
      resolveId(id: string) {
        if (id === 'virtual:elk-locales')
          return `\0${id}`
      },
      async load(id) {
        if (id === '\0virtual:elk-locales') {
          const sourceLanguageLocale = localeData.find(l => l[0] === vsCodeConfig['i18n-ally.sourceLanguage'])!
          const data: Record<string, LocaleEntry> = {}
          const entries: Record<string, any> = await readI18nFile(sourceLanguageLocale[1])
          const flatEntries = flatten<typeof entries, Record<string, string>>(entries)

          data.en = {
            translated: [],
            missing: [],
            outdated: [],
            title: 'English (source)',
            total: Object.keys(flatEntries).length,
            isSource: true,
          }

          await Promise.all(localeData.filter(l => l[0] !== 'en-US').map(async ([code, file, title]) => {
            // eslint-disable-next-line no-console
            console.info(`Comparing ${code}...`, title)
            data[code] = {
              title,
              translated: [],
              missing: [],
              outdated: [],
              total: 0,
            }
            await compare(flatEntries, file, data[code])
          }))
          return `export default ${JSON.stringify(data)}`
        }
      },
    }],
  },
})

function merge(src: Record<string, any>, dst: Record<string, any>) {
  for (const key in src) {
    if (typeof src[key] === 'object') {
      if (!dst[key])
        dst[key] = {}

      merge(src[key], dst[key])
    }
    else {
      dst[key] = src[key]
    }
  }
}

async function readI18nFile(file: string | string[]) {
  const resolver = createResolver(import.meta.url)
  if (Array.isArray(file)) {
    const files = await Promise.all(file.map(f => async () => {
      return JSON.parse(Buffer.from(
        await readFile(resolver.resolve(`../locales/${f}`), 'utf-8'),
      ).toString())
    })).then(f => f.map(f => f()))
    const data: Record<string, any> = files[0]
    files.splice(0, 1)
    files.forEach(f => merge(f, data))
    return data
  }
  else {
    return JSON.parse(Buffer.from(
      await readFile(resolver.resolve(`../locales/${file}`), 'utf-8'),
    ).toString())
  }
}

async function compare(
  baseEntries: Record<string, string>,
  file: string | string[],
  data: LocaleEntry,
) {
  const baseEntriesKeys = Object.keys(baseEntries)
  const entries: Record<string, any> = await readI18nFile(file)
  const flatEntriesKeys = Object.keys(flatten<typeof entries, Record<string, string>>(entries))

  data.translated = flatEntriesKeys.filter(e => baseEntriesKeys.includes(e))
  data.missing = baseEntriesKeys.filter(e => !flatEntriesKeys.includes(e))
  data.outdated = flatEntriesKeys.filter(e => !baseEntriesKeys.includes(e))
  data.total = flatEntriesKeys.length
}
