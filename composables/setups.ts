import { pwaInfo } from 'virtual:pwa-info'
import type { Link } from '@unhead/schema'
import type { Directions } from 'vue-i18n-routing'
import { APP_NAME } from '~/constants'
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
