import { readFile } from 'fs-extra'
import { resolve } from 'pathe'
import type { ManifestOptions } from 'vite-plugin-pwa'
import { getEnv } from '../../config/env'
import { i18n } from '../../config/i18n'
import type { LocaleObject } from '#i18n'

// We have to extend the ManifestOptions interface from 'vite-plugin-pwa'
// as that interface doesn't define the share_target field of Web App Manifests.
interface ExtendedManifestOptions extends ManifestOptions {
  share_target: {
    action: string
    method: string
    enctype: string
    params: {
      text: string
      url: string
      files: [{
        name: string
        accept: string[]
      }]
    }
  }
}

export type LocalizedWebManifest = Record<string, Partial<ExtendedManifestOptions>>

export const pwaLocales = i18n.locales as LocaleObject[]

type WebManifestEntry = Pick<ExtendedManifestOptions, 'name' | 'short_name' | 'description'>
type RequiredWebManifestEntry = Required<WebManifestEntry & Pick<ExtendedManifestOptions, 'dir' | 'lang'>>

export const createI18n = async (): Promise<LocalizedWebManifest> => {
  const { env } = await getEnv()
  const envName = `${env === 'release' ? '' : `(${env})`}`
  const { pwa } = await readI18nFile('en.json')

  const defaultManifest: Required<WebManifestEntry> = pwa.webmanifest[env]

  const locales: RequiredWebManifestEntry[] = await Promise.all(
    pwaLocales
      .filter(l => l.code !== 'en-US')
      .map(async ({ code, dir = 'ltr', file, files }) => {
        // read locale file or files
        const { pwa, app_name, app_desc_short } = file
          ? await readI18nFile(file)
          : await findBestWebManifestData(files, env)
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
      background_color: '#ffffff',
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
        {
          src: 'maskable-icon.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable',
        },
      ],
      share_target: {
        action: '/web-share-target',
        method: 'POST',
        enctype: 'multipart/form-data',
        params: {
          text: 'text',
          url: 'text',
          files: [
            {
              name: 'files',
              accept: ['image/*', 'video/*'],
            },
          ],
        },
      },
    }
    acc[`${lang}-dark`] = {
      scope: '/',
      id: '/',
      start_url: '/',
      display: 'standalone',
      lang,
      name,
      short_name,
      description,
      dir,
      background_color: '#111111',
      theme_color: '#111111',
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
        {
          src: 'maskable-icon.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable',
        },
      ],
      share_target: {
        action: '/web-share-target',
        method: 'POST',
        enctype: 'multipart/form-data',
        params: {
          text: 'text',
          url: 'text',
          files: [
            {
              name: 'files',
              accept: ['image/*', 'video/*'],
            },
          ],
        },
      },
    }

    return acc
  }, {} as LocalizedWebManifest)
}

async function readI18nFile(file: string) {
  return JSON.parse(Buffer.from(
    await readFile(resolve(`./locales/${file}`), 'utf-8'),
  ).toString())
}

interface PWAEntry {
  webmanifest?: Record<string, {
    name?: string
    short_name?: string
    description?: string
  }>
}

interface JsonEntry {
  pwa?: PWAEntry
  app_name?: string
  app_desc_short?: string
}

async function findBestWebManifestData(files: string[], env: string) {
  const entries: JsonEntry[] = await Promise.all(files.map(async (file) => {
    const { pwa, app_name, app_desc_short } = await readI18nFile(file)
    return { pwa, app_name, app_desc_short }
  }))

  let pwa: PWAEntry | undefined
  let app_name: string | undefined
  let app_desc_short: string | undefined

  for (const entry of entries) {
    const webmanifest = entry?.pwa?.webmanifest?.[env]
    if (webmanifest) {
      if (pwa) {
        if (webmanifest.name)
          pwa.webmanifest![env].name = webmanifest.name

        if (webmanifest.short_name)
          pwa.webmanifest![env].short_name = webmanifest.short_name

        if (webmanifest.description)
          pwa.webmanifest![env].description = webmanifest.description
      }
      else {
        pwa = entry.pwa
      }
    }

    if (entry.app_name)
      app_name = entry.app_name

    if (entry.app_desc_short)
      app_desc_short = entry.app_desc_short
  }

  return { pwa, app_name, app_desc_short }
}
