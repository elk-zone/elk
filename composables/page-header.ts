import { APP_NAME } from '~/constants'

export function usePageHeader() {
  const head = useHead({
    titleTemplate: title => `${title ? `${title} | ` : ''}${APP_NAME}${import.meta.env.DEV ? ' (dev)' : ''}`,
    link: [
      {
        rel: 'icon', type: 'image/svg+png', href: '/favicon.png',
      },
    ],
  })

  // eslint-disable-next-line no-unused-expressions
  isDark.value

  return head
}
