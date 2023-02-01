import type { Directions } from 'vue-i18n-routing'
import type { LocaleObject } from '#i18n'

export function setupPageHeader() {
  const { locale, locales, t } = useI18n()
  const colorMode = useColorMode()
  const buildInfo = useBuildInfo()
  const enablePinchToZoom = usePreferences('enablePinchToZoom')

  const localeMap = (locales.value as LocaleObject[]).reduce((acc, l) => {
    acc[l.code!] = l.dir ?? 'auto'
    return acc
  }, {} as Record<string, Directions>)

  useHeadFixed({
    htmlAttrs: {
      lang: () => locale.value,
      dir: () => localeMap[locale.value] ?? 'auto',
      class: () => enablePinchToZoom.value ? ['enable-pinch-to-zoom'] : [],
    },
    titleTemplate: (title) => {
      let titleTemplate = title ?? ''

      if (titleTemplate.match(/&[a-z0-9#]+;/gi)) {
        titleTemplate = unescapeTitleTemplate(titleTemplate, [
          ['"', ['&#34;', '&quot;']],
          ['&', ['&#38;', '&amp;']],
          ['\'', ['&#39;', '&apos;']],
          ['\u003C', ['&#60;', '&lt;']],
          ['\u003E', ['&#62;', '&gt;']],
        ])
        if (titleTemplate.length > 60)
          titleTemplate = `${titleTemplate.slice(0, 60)}...${titleTemplate.endsWith('"') ? '"' : ''}`

        if (!titleTemplate.includes('"'))
          titleTemplate = `"${titleTemplate}"`
      }
      else if (titleTemplate.length > 60) {
        titleTemplate = `${titleTemplate.slice(0, 60)}...${titleTemplate.endsWith('"') ? '"' : ''}`
      }

      titleTemplate += ` | ${t('app_name')}`
      if (buildInfo.env !== 'release')
        titleTemplate += ` (${buildInfo.env})`

      return titleTemplate
    },
    link: process.client && useAppConfig().pwaEnabled
      ? () => [{
          key: 'webmanifest',
          rel: 'manifest',
          href: `/manifest-${locale.value}${colorMode.value === 'dark' ? '-dark' : ''}.webmanifest`,
        }]
      : [],
  })
}

function unescapeTitleTemplate(titleTemplate: string, replacements: [string, string[]][]) {
  let result = titleTemplate
  for (const [replacement, entities] of replacements) {
    for (const e of entities)
      result = result.replaceAll(e, replacement)
  }
  return result.trim()
}
