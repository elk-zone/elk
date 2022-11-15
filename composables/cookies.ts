import { DEFAULT_SERVER } from '~/constants'

export function useAppCookies() {
  const server = useCookie('nuxtodon-server', { default: () => DEFAULT_SERVER })
  const token = useCookie('nuxtodon-token')

  return {
    server,
    token,
  }
}
