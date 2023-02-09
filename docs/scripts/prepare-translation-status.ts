import { flatten } from 'flat'
import { createResolver } from '@nuxt/kit'
import { readFile, writeFile } from 'fs-extra'
import { currentLocales } from '../../config/i18n'
import vsCodeConfig from '../../.vscode/settings.json'

export const localeData: [code: string, file: string[], title: string][]
    = currentLocales.map((l: any) => [l.code, l.files ? l.files : [l.file!], l.name ?? l.code])

interface LocaleEntry {
  title: string
  file: string
  translated: string[]
  missing: string[]
  outdated: string[]
  total: number
  isSource?: boolean
}

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
        await readFile(resolver.resolve(`../../locales/${f}`), 'utf-8'),
      ).toString())
    })).then(f => f.map(f => f()))
    const data: Record<string, any> = files[0]
    files.splice(0, 1)
    files.forEach(f => merge(f, data))
    return data
  }
  else {
    return JSON.parse(Buffer.from(
      await readFile(resolver.resolve(`../../locales/${file}`), 'utf-8'),
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

async function prepareTranslationStatus() {
  const sourceLanguageLocale = localeData.find(l => l[0] === vsCodeConfig['i18n-ally.sourceLanguage'])!
  const data: Record<string, LocaleEntry> = {}
  const entries: Record<string, any> = await readI18nFile(sourceLanguageLocale[1])
  const flatEntries = flatten<typeof entries, Record<string, string>>(entries)

  data.en = {
    translated: [],
    file: 'en.json',
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
      file: Array.isArray(file) ? file[file.length - 1] : file,
      translated: [],
      missing: [],
      outdated: [],
      total: 0,
    }
    await compare(flatEntries, file, data[code])
  }))

  const sorted: Record<string, any> = { en: { ...data.en } }

  Object.keys(data).filter(k => k !== 'en').sort((a, b) => {
    return data[a].translated.length - data[b].translated.length
  }).forEach((k) => {
    sorted[k] = { ...data[k] }
  })

  await writeFile(
    createResolver(import.meta.url).resolve('../translation-status.json'),
    JSON.stringify(sorted, null, 2),
    { encoding: 'utf-8' },
  )
}

prepareTranslationStatus()
