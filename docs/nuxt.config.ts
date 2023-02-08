import { readFile } from 'fs-extra'
import { createResolver } from '@nuxt/kit'
import { localeData } from '../config/i18n'

interface LocaleEntry {
  title: string
  translated: string[]
  missing: string[]
  outdated: string[]
  total: number
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
          const enUS = localeData.find(l => l[0] === 'en-US')!
          const data: Record<string, LocaleEntry> = {}
          const enUSEntries: Record<string, any> = await readI18nFile(enUS[1])
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
            code === 'ar-EG' && await compare(enUSEntries, file, data[code]!)
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

const compareEntry = (
  direct: boolean,
  data: LocaleEntry,
  left?: Record<string, any> | string,
  right?: Record<string, any> | string,
  path = '',
) => {
  if (!left && !right)
    return

  if (!left && right) {
    if (direct)
      data.outdated.push(path)
    else
      data.missing.push(path)

    return
  }

  if (left && !right) {
    if (direct)
      data.missing.push(path)
    else
      data.outdated.push(path)

    return
  }

  if (typeof left === 'string' && typeof right === 'string')
    return

  if (typeof left === 'object' && typeof right === 'string') {
    if (direct)
      data.outdated.push(path)
    else
      data.missing.push(path)

    return
  }

  if (typeof left === 'string' && typeof right === 'object') {
    if (direct)
      data.missing.push(path)
    else
      data.outdated.push(path)

    return
  }

  const nLeft = left as Record<string, any>
  const nRight = right as Record<string, any>

  for (const key in Object.keys(nLeft)) {
    /* if (typeof nLeft[key] === 'string' && typeof nRight[key] === 'string')
      continue

    if (typeof nLeft[key] === 'object' && typeof nRight[key] === 'string') {
      if (direct)
        data.outdated.push(path)
      else
        data.missing.push(path)

      continue
    }

    if (typeof nLeft[key] === 'string' && typeof nRight[key] === 'object') {
      if (direct)
        data.missing.push(path)
      else
        data.outdated.push(path)

      continue
    } */

    compareEntry(direct, data, nLeft[key], nRight[key], path.length > 0 ? `${path}.${key}` : key)
  }
}

async function compare(
  baseEntries: Record<string, any>,
  file: string | string[],
  data: LocaleEntry,
) {
  const entries: Record<string, any> = await readI18nFile(file)
  for (const key in baseEntries)
    compareEntry(true, data, baseEntries[key], entries[key], key)

  // Object.keys(entries).forEach((key) => {
  //   compareEntry(false, data, entries[key], baseEntries[key])
  // })
}
