import type { ManifestOptions } from 'vite-plugin-pwa'
import { Buffer } from 'node:buffer'
import { readFile } from 'node:fs/promises'
import { createResolver } from '@nuxt/kit'
import { getEnv } from '../../config/env'
import { currentLocales } from '../../config/i18n'
import { THEME_COLORS } from '../../constants/index'

export type LocalizedWebManifest = Record<string, Partial<ManifestOptions>>

export const pwaLocales = currentLocales

type WebManifestEntry = Pick<ManifestOptions, 'name' | 'short_name' | 'description' | 'screenshots' | 'shortcuts'>
type RequiredWebManifestEntry = Required<WebManifestEntry & Pick<ManifestOptions, 'dir' | 'lang' | 'screenshots' | 'shortcuts'>>

export async function createI18n(): Promise<LocalizedWebManifest> {
  const { env } = await getEnv()
  const envName = `${env === 'release' ? '' : `(${env})`}`
  const { action, nav, pwa } = await readI18nFile('en.json')

  const defaultManifest: Required<WebManifestEntry> = pwa.webmanifest[env]

  const defaultShortcuts: ManifestOptions['shortcuts'] = [{
    name: nav.home,
    url: '/home',
    icons: [
      { src: 'shortcuts/home-96x96.png', sizes: '96x96', type: 'image/png' },
      { src: 'shortcuts/home.png', sizes: '192x192', type: 'image/png' },
    ],
  }, {
    name: nav.local,
    url: '/?local-pwa-shortcut=true',
    icons: [
      { src: 'shortcuts/local-96x96.png', sizes: '96x96', type: 'image/png' },
      { src: 'shortcuts/local.png', sizes: '192x192', type: 'image/png' },
    ],
  }, {
    name: nav.notifications,
    url: '/?notifications-pwa-shortcut=true',
    icons: [
      { src: 'shortcuts/notifications-96x96.png', sizes: '96x96', type: 'image/png' },
      { src: 'shortcuts/notifications.png', sizes: '192x192', type: 'image/png' },
    ],
  }, {
    name: action.compose,
    url: '/compose',
    icons: [
      { src: 'shortcuts/compose-96x96.png', sizes: '96x96', type: 'image/png' },
      { src: 'shortcuts/compose.png', sizes: '192x192', type: 'image/png' },
    ],
  }, {
    name: nav.settings,
    url: '/settings',
    icons: [
      { src: 'shortcuts/settings-96x96.png', sizes: '96x96', type: 'image/png' },
      { src: 'shortcuts/settings.png', sizes: '192x192', type: 'image/png' },
    ],
  }]

  const defaultScreenshots: ManifestOptions['screenshots'] = [{
    src: 'screenshots/dark-1.webp',
    sizes: '3840x2400',
    type: 'image/webp',
    label: pwa.screenshots.dark,
  }, {
    src: 'screenshots/light-1.webp',
    sizes: '3840x2400',
    type: 'image/webp',
    label: pwa.screenshots.light,
  }]

  const manifestEntries: Partial<ManifestOptions> = {
    scope: '/',
    id: '/',
    start_url: '/',
    orientation: 'natural',
    display: 'standalone',
    display_override: ['window-controls-overlay'],
    categories: ['social', 'social networking', 'news'],
    icons: [
      {
        src: 'pwa-64x64.png',
        sizes: '64x64',
        type: 'image/png',
      },
      {
        src: 'pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: 'maskable-icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    share_target: {
      action: '/web-share-target',
      method: 'POST',
      enctype: 'multipart/form-data',
      params: {
        title: 'title',
        text: 'text',
        url: 'url',
        files: [
          {
            name: 'files',
            accept: ['image/*', 'video/*'],
          },
        ],
      },
    },
    handle_links: 'preferred',
    launch_handler: {
      client_mode: ['navigate-existing', 'auto'],
    },
    edge_side_panel: {
      preferred_width: 480,
    },
  }

  if (env === 'release') {
    manifestEntries.prefer_related_applications = true
    manifestEntries.related_applications = [{
      platform: 'windows',
      url: 'https://www.microsoft.com/store/apps/9PNZMMXQHQZ5',
      id: '53213ElkTeam.Elk_6x2f3wfg7gnst',
    }]
  }

  const locales: RequiredWebManifestEntry[] = await Promise.all(
    pwaLocales
      .filter(l => l.code !== 'en-US')
      .map(async ({ code, dir = 'ltr', file, files }) => {
        // read locale file or files
        const { action, app_desc_short, app_name, nav, pwa } = file
          ? await readI18nFile(file as string)
          : await findBestWebManifestData(files as string[], env)
        const entry = pwa?.webmanifest?.[env] ?? {}

        if (!entry.name && app_name)
          entry.name = dir === 'rtl' ? `${envName} ${app_name}` : `${app_name} ${envName}`

        if (!entry.short_name && app_name)
          entry.short_name = dir === 'rtl' ? `${envName} ${app_name}` : `${app_name} ${envName}`

        if (!entry.description && app_desc_short)
          entry.description = app_desc_short

        // clone default screenshots and shortcuts
        const useScreenshots = [...defaultScreenshots.map(screenshot => ({ ...screenshot }))]
        const useShortcuts = [...defaultShortcuts.map(shortcut => ({ ...shortcut }))]

        const pwaScreenshots = pwa?.screenshots
        if (pwaScreenshots) {
          useScreenshots.forEach((screenshot, idx) => {
            if (idx === 0 && pwaScreenshots?.dark)
              screenshot.label = pwaScreenshots.dark

            if (idx === 1 && pwaScreenshots?.light)
              screenshot.label = pwaScreenshots.light
          })
        }

        useShortcuts.forEach((shortcut, idx) => {
          if (idx === 0 && nav?.home)
            shortcut.name = nav.home

          if (idx === 1 && nav?.local)
            shortcut.name = nav.local

          if (idx === 2 && nav?.notifications)
            shortcut.name = nav.notifications

          if (idx === 3 && action?.compose)
            shortcut.name = action?.compose

          if (idx === 4 && nav?.settings)
            shortcut.name = nav.settings
        })

        return <RequiredWebManifestEntry>{
          ...defaultManifest,
          ...entry,
          lang: code,
          dir,
          screenshots: useScreenshots,
          shortcuts: useShortcuts,
        }
      }),
  )
  locales.push({
    ...defaultManifest,
    lang: 'en-US',
    dir: 'ltr',
    screenshots: defaultScreenshots,
    shortcuts: defaultShortcuts,
  })
  return locales.reduce((acc, {
    lang,
    dir,
    name,
    short_name,
    description,
    shortcuts,
    screenshots,
  }) => {
    acc[lang] = {
      lang,
      name,
      short_name,
      description,
      dir,
      background_color: THEME_COLORS.backgroundLight,
      theme_color: THEME_COLORS.themeLight,
      ...manifestEntries,
      shortcuts,
      screenshots,
    }
    acc[`${lang}-dark`] = {
      lang,
      name,
      short_name,
      description,
      dir,
      background_color: THEME_COLORS.backgroundDark,
      theme_color: THEME_COLORS.themeDark,
      ...manifestEntries,
      shortcuts,
      screenshots,
    }

    return acc
  }, {} as LocalizedWebManifest)
}

async function readI18nFile(file: string) {
  const { resolve } = createResolver(import.meta.url)
  return JSON.parse(Buffer.from(
    await readFile(resolve(`../../locales/${file}`), 'utf-8'),
  ).toString())
}

interface PWAEntry {
  webmanifest?: Record<string, {
    name?: string
    short_name?: string
    description?: string
  }>
  screenshots?: Record<string, string>
  shortcuts?: Record<string, string>
}

interface JsonEntry {
  pwa?: PWAEntry
  app_name?: string
  app_desc_short?: string
  action?: Record<string, any>
  nav?: Record<string, any>
  screenshots?: Record<string, string>
}

async function findBestWebManifestData(files: string[], env: string) {
  const entries: JsonEntry[] = await Promise.all(files.map(async (file) => {
    const { action, app_name, app_desc_short, nav, pwa } = await readI18nFile(file)
    return { action, app_name, app_desc_short, nav, pwa }
  }))

  let pwa: PWAEntry | undefined
  let app_name: string | undefined
  let app_desc_short: string | undefined
  const action: Record<string, any> = {}
  const nav: Record<string, any> = {}

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

    if (entry.nav) {
      ['home', 'local', 'notifications', 'settings'].forEach((key) => {
        const value = entry.nav![key]
        if (value)
          nav[key] = value
      })
    }

    if (entry.action?.compose)
      action.compose = entry.action.compose

    if (entry.pwa?.screenshots) {
      if (!pwa)
        pwa = {}

      pwa.screenshots = pwa.screenshots ?? {}
      Object
        .entries(entry.pwa.screenshots)
        .forEach(([key, value]) => pwa!.screenshots![key] = value)
    }
  }

  return { action, app_desc_short, app_name, nav, pwa }
}
