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
  // TODO: guess user language

  const { locale, setLocale } = useI18n()
  const localeStorage = useLocalStorage(STORAGE_KEY_LANG, locale.value)

  if (localeStorage.value !== locale.value)
    await setLocale(localeStorage.value)

  watchEffect(() => {
    localeStorage.value = locale.value
  })
}
