import type { Directions } from 'vue-i18n-routing'
import type { LocaleObject } from '#i18n'

export function setupPageHeader() {
  const { locale, locales, t } = useI18n()
  const colorMode = useColorMode()
  const buildInfo = useBuildInfo()

  const localeMap = (locales.value as LocaleObject[]).reduce((acc, l) => {
    acc[l.code!] = l.dir ?? 'auto'
    return acc
  }, {} as Record<string, Directions>)

  const publicRuntimeConfig = useRuntimeConfig().public

  useHeadFixed({
    htmlAttrs: {
      lang: () => locale.value,
      dir: () => localeMap[locale.value] ?? 'auto',
    },
    titleTemplate: (title) => {
      let titleTemplate = title ? `${title} | ` : ''
      titleTemplate += t('app_name')
      if (buildInfo.env !== 'release')
        titleTemplate += ` (${buildInfo.env})`
      return titleTemplate
    },
    link: process.client && publicRuntimeConfig.pwaEnabled && !publicRuntimeConfig.tauriPlatform
      ? () => [{
          key: 'webmanifest',
          rel: 'manifest',
          href: `/manifest-${locale.value}${colorMode.value === 'dark' ? '-dark' : ''}.webmanifest`,
        }]
      : process.client && publicRuntimeConfig.pwaEnabled && publicRuntimeConfig.tauriPlatform
        ? () => [{
            rel: 'manifest',
            href: '/manifest.webmanifest',
          }]
        : [],
  })
}
