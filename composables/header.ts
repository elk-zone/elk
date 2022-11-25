import { pwaInfo } from 'virtual:pwa-info'
import type { Head } from '@unhead/schema'
import { APP_NAME } from '~/constants'

export function useHeader() {
  const head: Head = {
    titleTemplate: title => `${title ? `${title} | ` : ''}${APP_NAME}${import.meta.env.DEV ? ' (dev)' : ''}`,
    link: [
      {
        rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg',
      },
      {
        rel: 'alternate icon', type: 'image/x-icon', href: '/favicon.ico',
      },
      {
        rel: 'icon', type: 'image/png', href: '/favicon-16x16.png', sizes: '16x16x',
      },
      {
        rel: 'icon', type: 'image/png', href: '/favicon-32x32.png', sizes: '32x32',
      },
    ],
  }

  if (pwaInfo && pwaInfo.webManifest) {
    head.meta = [
      { name: 'theme-color', content: '#ffffff' },
    ]
    head.link!.push({
      rel: 'mask-icon',
      href: '/safari-pinned-tab.svg',
      color: '#ffffff',
    })
    head.link!.push({
      rel: 'apple-touch-icon',
      href: '/apple-touch-icon.png',
      sizes: '180x180',
    })
    const { webManifest } = pwaInfo
    if (webManifest) {
      const { href, useCredentials } = webManifest
      if (useCredentials) {
        head.link!.push({
          rel: 'manifest',
          href,
          crossorigin: 'use-credentials',
        })
      }
      else {
        head.link!.push({
          rel: 'manifest',
          href,
        })
      }
    }
  }

  useHead(head)

  // eslint-disable-next-line no-unused-expressions
  isDark.value
}
