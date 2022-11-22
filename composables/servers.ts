import type { ServerInfo } from '~/types'

const ServerInfoTTL = 60 * 60 * 1000 * 12 // 12 hour

const serverInfoPromise = new Map<string, Promise<ServerInfo>>()
const serverInfos = useLocalStorage<Record<string, ServerInfo>>('nuxtodon-server-info', {})

async function _fetchServerInfo(server: string) {
  if (!serverInfos.value[server]) {
    // @ts-expect-error init
    serverInfos.value[server] = {
      timeUpdated: 0,
      server,
    }
  }
  if (serverInfos.value[server].timeUpdated + ServerInfoTTL < Date.now()) {
    await Promise.allSettled([
      masto.instances.fetch().then((r) => {
        Object.assign(serverInfos.value[server], r)
      }),
      masto.customEmojis.fetchAll().then((r) => {
        serverInfos.value[server].customEmojis = Object.fromEntries(r.map(i => [i.shortcode, i]))
      }),
    ])
  }
  return serverInfos.value[server]
}

export function fetchServerInfo(server: string) {
  if (!serverInfoPromise.has(server))
    serverInfoPromise.set(server, _fetchServerInfo(server))
  return serverInfoPromise.get(server)!
}

export function useServerInfo(server: string) {
  const info = ref<ServerInfo | undefined>()
  fetchServerInfo(server).then((r) => {
    info.value = r
  })
  return info
}
