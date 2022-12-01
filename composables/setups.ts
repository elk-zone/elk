import { APP_NAME, STORAGE_KEY_LANG, STORAGE_KEY_MANUAL_CHANGE_LANG } from '~/constants'

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

// If user manual change locale, we should use storage locale
// But when user first visit, we should use navigator language
export async function setupI18n() {
  const { locale, setLocale } = useI18n()
  const localeStorage = useLocalStorage(STORAGE_KEY_LANG, locale.value)
  const manualChangeStorage = useLocalStorage(STORAGE_KEY_MANUAL_CHANGE_LANG, false)

  const preferredLocale = useNavigatorLanguage().language.value

  if (!manualChangeStorage.value) {
    await setLocale(preferredLocale ?? '')
  }
  else {
    if (localeStorage.value !== locale.value)
      await setLocale(localeStorage.value)
  }

  watchEffect(() => {
    localeStorage.value = locale.value
  })
}
