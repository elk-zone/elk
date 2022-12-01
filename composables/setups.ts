import { APP_NAME, STORAGE_KEY_LANG } from '~/constants'

const isDev = process.dev
const isPreview = window.location.hostname.includes('deploy-preview')

export function setupPageHeader() {
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
      { rel: 'icon', type: 'image/svg+png', href: isDev || isPreview ? '/favicon-dev.png' : '/favicon.png' },
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
    const userLang = window.navigator.language || 'en-US'
    const lang = (unref(locales) as { code: string }[]).find(locale => locale.code.toLowerCase().startsWith(userLang.toLocaleLowerCase()))?.code || 'en-US'
    localeStorage.value = lang
  }

  if (localeStorage.value !== locale.value)
    await setLocale(localeStorage.value)

  watchEffect(() => {
    localeStorage.value = locale.value
  })
}
