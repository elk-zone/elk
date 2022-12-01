import { APP_NAME, STORAGE_KEY_LANG } from '~/constants'
import { DEFAULT_I18N_LOCALE, I18NLocales } from '~~/constants/i18n'

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
  const { locale, setLocale } = useI18n()
  const localeStorage = useLocalStorage(STORAGE_KEY_LANG, locale.value)

  // Authority: storage > preferred > default
  if (localeStorage.value) {
    if (localeStorage.value.toLocaleLowerCase() !== locale.value.toLocaleLowerCase())
      await setLocale(localeStorage.value)
  }
  else {
    const preferredLocale = (useNavigatorLanguage().language.value ?? DEFAULT_I18N_LOCALE).toLocaleLowerCase()
    const supportedLocale = I18NLocales.map(i => i.code.toLocaleLowerCase())
    if (supportedLocale.includes(preferredLocale))
      await setLocale(preferredLocale)
  }

  watchEffect(() => {
    localeStorage.value = locale.value
  })
}
