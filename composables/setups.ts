import { pwaInfo } from 'virtual:pwa-info'
import type { Link } from '@unhead/schema'
import type { Directions } from 'vue-i18n-routing'
import { init as initEmojis } from 'emoji-mart'
import { APP_NAME, STORAGE_KEY_LANG } from '~/constants'
import type { LocaleObject } from '#i18n'

export function setupPageHeader() {
  const isDev = process.dev
  const isPreview = useRuntimeConfig().public.env === 'staging'

  const i18n = useI18n()

  const link: Link[] = []

  if (pwaInfo && pwaInfo.webManifest) {
    const { webManifest } = pwaInfo
    if (webManifest) {
      const { href, useCredentials } = webManifest
      if (useCredentials) {
        link.push({
          rel: 'manifest',
          href,
          crossorigin: 'use-credentials',
        })
      }
      else {
        link.push({
          rel: 'manifest',
          href,
        })
      }
    }
  }

  const localeMap = (i18n.locales.value as LocaleObject[]).reduce((acc, l) => {
    acc[l.code!] = l.dir ?? 'ltr'
    return acc
  }, {} as Record<string, Directions>)

  useHeadFixed({
    htmlAttrs: {
      lang: () => i18n.locale.value,
      dir: () => localeMap[i18n.locale.value] ?? 'ltr',
    },
    titleTemplate: title => `${title ? `${title} | ` : ''}${APP_NAME}${isDev ? ' (dev)' : isPreview ? ' (preview)' : ''}`,
    link,
  })

  // eslint-disable-next-line no-unused-expressions
  isDark.value
}

export async function setupI18n() {
  const { locale, setLocale, locales } = useI18n()
  const nuxtApp = useNuxtApp()
  nuxtApp.hook('app:suspense:resolve', async () => {
    const isFirstVisit = process.server ? false : !window.localStorage.getItem(STORAGE_KEY_LANG)
    const localeStorage = process.server ? ref('en-US') : useLocalStorage(STORAGE_KEY_LANG, locale.value)

    if (isFirstVisit) {
      const userLang = (navigator.language || 'en-US').toLowerCase()
      // cause vue-i18n not explicit export LocaleObject type
      const supportLocales = unref(locales) as { code: string }[]
      const lang = supportLocales.find(locale => userLang.startsWith(locale.code.toLowerCase()))?.code
      || supportLocales.find(locale => userLang.startsWith(locale.code.split('-')[0]))?.code
      localeStorage.value = lang || 'en-US'
    }

    if (localeStorage.value !== locale.value)
      await setLocale(localeStorage.value)

    watchEffect(() => {
      localeStorage.value = locale.value
    })
  })
}

export function setupEmojis() {
  initEmojis({
    data: () => import('@emoji-mart/data').then(r => r.default),
  })
}
