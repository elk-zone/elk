import type { Directions } from 'vue-i18n-routing'
import { decode } from 'tiny-decode'
import type { LocaleObject } from '#i18n'

export function setupPageHeader() {
  const { locale, locales, t } = useI18n()
  const colorMode = useColorMode()
  const buildInfo = useBuildInfo()

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

      if (titleTemplate.match(/&[a-z0-9#]+;/gi)) {
        titleTemplate = decode(titleTemplate)
          .replaceAll('&#60;', '\u003C').replaceAll('&lt;', '\u003C')
          .replaceAll('&#62;', '\u003E').replaceAll('&gt;', '\u003E')
        if (!titleTemplate.includes('"'))
          titleTemplate = `"${titleTemplate}"`
      }

      return titleTemplate
    },
    link: process.client && useRuntimeConfig().public.pwaEnabled
      ? () => [{
          key: 'webmanifest',
          rel: 'manifest',
          href: `/manifest-${locale.value}${colorMode.value === 'dark' ? '-dark' : ''}.webmanifest`,
        }]
      : [],
  })
}
