import { APP_NAME, STORAGE_KEY_LANG } from '~/constants'

export function setupPageHeader() {
  const isDev = process.dev
  const isPreview = useRuntimeConfig().public.env === 'staging'
  const suffix = isDev || isPreview ? '-dev' : ''

  const i18n = useI18n()

  useHeadFixed({
    htmlAttrs: {
      lang: () => i18n.locale.value,
    },
    titleTemplate: title => `${title ? `${title} | ` : ''}${APP_NAME}${isDev ? ' (dev)' : isPreview ? ' (preview)' : ''}`,
    bodyAttrs: {
      class: 'overflow-x-hidden',
    },
    link: [
      { rel: 'icon', type: 'image/svg+xml', href: `/favicon${suffix}.svg` },
      { rel: 'alternate icon', type: 'image/x-icon', href: `/favicon${suffix}.ico` },
      { rel: 'icon', type: 'image/png', href: `/favicon-16x16${suffix}.png`, sizes: '16x16' },
      { rel: 'icon', type: 'image/png', href: `/favicon-32x32${suffix}.png`, sizes: '32x32' },
    ],
  })

  // eslint-disable-next-line no-unused-expressions
  isDark.value
}

export async function setupI18n() {
  const { locale, setLocale, locales } = useI18n()
  const isFirstVisit = !window.localStorage.getItem(STORAGE_KEY_LANG)
  const localeStorage = useLocalStorage(STORAGE_KEY_LANG, locale.value)

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
}
