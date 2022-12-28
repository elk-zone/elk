import { pwaInfo } from 'virtual:pwa-info'
import type { Link } from '@unhead/schema'
import type { Directions } from 'vue-i18n-routing'
import { APP_NAME, COOKIE_MAX_AGE, STORAGE_KEY_LANG } from '~/constants'
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
    acc[l.code!] = l.dir ?? 'auto'
    return acc
  }, {} as Record<string, Directions>)

  useHeadFixed({
    htmlAttrs: {
      lang: () => i18n.locale.value,
      dir: () => localeMap[i18n.locale.value] ?? 'auto',
    },
    titleTemplate: title => `${title ? `${title} | ` : ''}${APP_NAME}${isDev ? ' (dev)' : isPreview ? ' (preview)' : ''}`,
    link,
  })
}

export async function setupI18n() {
  const { locale, setLocale, locales } = useI18n()
  const cookieLocale = useCookie(STORAGE_KEY_LANG, { maxAge: COOKIE_MAX_AGE })
  const isFirstVisit = cookieLocale.value == null

  if (process.client && isFirstVisit) {
    const userLang = (navigator.language || 'en-US').toLowerCase()
    // cause vue-i18n not explicit export LocaleObject type
    const supportLocales = unref(locales) as { code: string }[]
    const lang = supportLocales.find(locale => userLang.startsWith(locale.code.toLowerCase()))?.code
      || supportLocales.find(locale => userLang.startsWith(locale.code.split('-')[0]))?.code
    cookieLocale.value = lang || 'en-US'
  }

  if (cookieLocale.value && cookieLocale.value !== locale.value)
    await setLocale(cookieLocale.value)

  if (process.client) {
    watchEffect(() => {
      cookieLocale.value = locale.value
    })
  }
}

export async function setupEmojis() {
  if (process.client) {
    const promise = import('@emoji-mart/data').then(r => r.default)
    const { init } = await import('emoji-mart')
    init({
      data: () => promise,
    })
  }
}
