import { readFile } from 'fs-extra'
import { resolve } from 'pathe'
import type { ManifestOptions } from 'vite-plugin-pwa'
import { getEnv } from '../../config/env'
import { i18n } from '../../config/i18n'
import type { LocaleObject } from '#i18n'

export type LocalizedWebManifest = Record<string, Partial<ManifestOptions>>

export const pwaLocales = i18n.locales as LocaleObject[]

type WebManifestEntry = Pick<ManifestOptions, 'name' | 'short_name' | 'description'>
type RequiredWebManifestEntry = Required<WebManifestEntry & Pick<ManifestOptions, 'dir' | 'lang'>>

export const createI18n = async (): Promise<LocalizedWebManifest> => {
  const { env } = await getEnv()
  const envName = `${env === 'release' ? '' : `(${env})`}`
  const { pwa } = await readI18nFile('en-US.json')

  const defaultManifest: Required<WebManifestEntry> = pwa.webmanifest[env]

  const locales: RequiredWebManifestEntry[] = await Promise.all(
    pwaLocales
      .filter(l => l.code !== 'en-US')
      .map(async ({ code, dir = 'ltr', file }) => {
        // read locale file
        const { pwa, app_name, app_desc_short } = await readI18nFile(file!)
        const entry: WebManifestEntry = pwa?.webmanifest?.[env] ?? {}
        if (!entry.name && app_name)
          entry.name = dir === 'rtl' ? `${envName} ${app_name}` : `${app_name} ${envName}`

        if (!entry.short_name && app_name)
          entry.short_name = dir === 'rtl' ? `${envName} ${app_name}` : `${app_name} ${envName}`

        if (!entry.description && app_desc_short)
          entry.description = app_desc_short

        return <RequiredWebManifestEntry>{
          ...defaultManifest,
          ...entry,
          lang: code,
          dir,
        }
      }),
  )
  locales.push({
    ...defaultManifest,
    lang: 'en-US',
    dir: 'ltr',
  })
  return locales.reduce((acc, { lang, dir, name, short_name, description }) => {
    acc[lang] = {
      scope: '/',
      id: '/',
      start_url: '/',
      display: 'standalone',
      lang,
      name,
      short_name,
      description,
      dir,
      theme_color: '#ffffff',
      icons: [
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    }

    return acc
  }, {} as LocalizedWebManifest)
}

async function readI18nFile(file: string) {
  return JSON.parse(Buffer.from(
    await readFile(resolve(`./locales/${file}`), 'utf-8'),
  ).toString())
}
