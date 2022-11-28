import { APP_NAME } from '~/constants'

const isDev = process.dev
const isPreview = window.location.hostname.includes('deploy-preview')

export function usePageHeader() {
  useHead({
    titleTemplate: title => `${title ? `${title} | ` : ''}${APP_NAME}${isDev ? ' (dev)' : isPreview ? ' (preview)' : ''}`,
    link: [
      { rel: 'icon', type: 'image/svg+png', href: isDev || isPreview ? '/favicon-dev.png' : '/favicon.png' },
    ],
  })

  // eslint-disable-next-line no-unused-expressions
  isDark.value
}
