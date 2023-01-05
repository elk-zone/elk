import { readFile } from 'fs-extra'
import { resolve } from 'pathe'
import type { ManifestOptions } from 'vite-plugin-pwa'
import { getEnv } from '../../config/env'
import { i18n } from '../../config/i18n'
import type { LocaleObject } from '#i18n'

export type LocalizedWebManifest = Record<string, Partial<ManifestOptions>>

export const pwaLocales = i18n.locales as LocaleObject[]

export const createI18n = async (): Promise<LocalizedWebManifest> => {
  const { env } = await getEnv()
  const envName = `${env === 'release' ? '' : ` (${env})`}`
  const { app_desc_short, app_name } = await readI18nFile('en-US.json')

  const locales = await Promise.all(pwaLocales.filter(l => l.code !== 'en-US').map(async ({ code, dir = 'ltr', file }) => {
    // read locale file
    const {
      app_desc_short: description = app_desc_short,
      app_name: name = `${app_name}${envName}`,
    } = await readI18nFile(file!)
    return {
      lang: code,
      name,
      dir,
      short_name: name,
      description,
    }
  }))
  locales.push({
    lang: 'en-US',
    name: `${app_name}${envName}`,
    dir: 'ltr',
    short_name: `${app_name}${envName}`,
    description: app_desc_short,
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
      dir: dir === 'auto' ? undefined : dir,
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
