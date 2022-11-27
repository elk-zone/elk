import { APP_NAME } from '~/constants'

export function usePageHeader() {
  useHead({
    titleTemplate: title => `${title ? `${title} | ` : ''}${APP_NAME}${process.dev ? ' (dev)' : ''}`,
    link: [{ rel: 'icon', type: 'image/svg+png', href: '/favicon.png' }],
  })

  // eslint-disable-next-line no-unused-expressions
  isDark.value
}
