import { APP_NAME } from '~/constants'

export function usePageHeader() {
  useHead({
    titleTemplate: title => `${title ? `${title} | ` : ''}${APP_NAME}${process.dev ? ' (dev)' : window.location.hostname.includes('deploy-preview') ? '(preview)' : ''}`,
  })

  // eslint-disable-next-line no-unused-expressions
  isDark.value
}
