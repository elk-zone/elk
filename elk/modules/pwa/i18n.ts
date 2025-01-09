import type { ManifestOptions } from 'vite-plugin-pwa'
import { Buffer } from 'node:buffer'
import { readFile } from 'node:fs/promises'
import { createResolver } from '@nuxt/kit'
import { getEnv } from '../../config/env'
import { currentLocales } from '../../config/i18n'

export type LocalizedWebManifest = Record<string, Partial<ManifestOptions>>

export const pwaLocales = currentLocales

type WebManifestEntry = Pick<ManifestOptions, 'name' | 'short_name' | 'description' | 'screenshots' | 'shortcuts'>
type RequiredWebManifestEntry = Required<WebManifestEntry & Pick<ManifestOptions, 'dir' | 'lang' | 'screenshots' | 'shortcuts'>>

export async function createI18n(): Promise<RequiredWebManifestEntry> {
  const { env } = await getEnv()
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
    name: nav.bubble,
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

  return {
    ...defaultManifest,
    dir: 'ltr',
    lang: 'en_US',
    ...manifestEntries,
    shortcuts: defaultShortcuts,
    screenshots: defaultScreenshots,
  }
}

async function readI18nFile(file: string) {
  const { resolve } = createResolver(import.meta.url)
  return JSON.parse(Buffer.from(
    await readFile(resolve(`../../locales/${file}`), 'utf-8'),
  ).toString())
}
