import type { Link } from '@unhead/schema'
import type { Directions } from 'vue-i18n-routing'
import { buildInfo } from 'virtual:build-info'
import type { LocaleObject } from '#i18n'

export function setupPageHeader() {
  const { locale, locales, t } = useI18n()

  const link = process.client && useRuntimeConfig().public.pwaEnabled
    ? computed<Link[]>(() => {
      return [{
        key: `webmanifest-${locale.value}`,
        rel: 'manifest',
        href: `/manifest-${locale.value}.webmanifest`,
      }]
    })
    : []

  const localeMap = (locales.value as LocaleObject[]).reduce((acc, l) => {
    acc[l.code!] = l.dir ?? 'auto'
    return acc
  }, {} as Record<string, Directions>)

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
    link,
  })
}
