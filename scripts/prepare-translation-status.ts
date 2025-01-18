import type { LocaleEntry } from '../docs/types'
import type { ElkTranslationStatus } from '~/types/translation-status'
import { Buffer } from 'node:buffer'
import { readFile, writeFile } from 'node:fs/promises'
import { createResolver } from '@nuxt/kit'
import { flatten } from 'flat'
import { countryLocaleVariants, currentLocales } from '../config/i18n'

export const localeData: [code: string, file: string[], title: string][]
    = currentLocales.map((l: any) => [l.code, l.files ? l.files : [l.file!], l.name ?? l.code])

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

async function prepareTranslationStatus() {
  const sourceLanguageLocale = localeData.find(l => l[0] === 'en-US')!
  const entries: Record<string, any> = await readI18nFile(sourceLanguageLocale[1])
  const flatEntries = flatten<typeof entries, Record<string, string>>(entries)
  const total = Object.keys(flatEntries).length
  const data: Record<string, LocaleEntry & { useFile: string }> = {
    en: {
      translated: [],
      file: 'en.json',
      useFile: 'en.json',
      missing: [],
      outdated: [],
      title: 'English (source)',
      total,
      isSource: true,
    },
  }

  await Promise.all(localeData.filter(l => l[0] !== 'en-US').map(async ([code, file, title]) => {
    console.info(`Comparing ${code}...`, title)
    let useFile = file[file.length - 1]
    const entry = countryLocaleVariants[file[0].slice(0, file[0].indexOf('.'))]
    if (entry) {
      const countryFile = entry.find(e => e.code === code && e.country === true)
      if (countryFile)
        useFile = file[0]
    }
    data[code] = {
      title,
      useFile,
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

  const resolver = createResolver(import.meta.url)

  await writeFile(
    resolver.resolve('../docs/translation-status.json'),
    JSON.stringify(sorted, null, 2),
    { encoding: 'utf-8' },
  )

  const translationStatus: ElkTranslationStatus = {
    total,
    locales: {
      'en-US': {
        total,
        percentage: '100',
      },
    },
  }

  Object.keys(data).filter(k => k !== 'en').forEach((e) => {
    const percentage = (total <= 0.0 || data[e].total === 0.0)
      ? '0'
      : data[e].total === total
        ? '100'
        : ((data[e].translated.length / total) * 100).toFixed(1)

    translationStatus.locales[e] = {
      total: data[e].total,
      percentage,
    }
  })

  await writeFile(
    resolver.resolve('../elk-translation-status.json'),
    JSON.stringify(translationStatus, null, 2),
    { encoding: 'utf-8' },
  )
}

prepareTranslationStatus()
