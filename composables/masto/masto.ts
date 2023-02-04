import type { Pausable } from '@vueuse/core'
import type { CreateClientParams, WsEvents, mastodon } from 'masto'
import { createClient, fetchV1Instance } from 'masto'
import type { Ref } from 'vue'
import type { ElkInstance } from '../users'
import type { Mutable } from '~/types/utils'
import type { UserLogin } from '~/types'

export const createMasto = () => {
  let client = $shallowRef<mastodon.Client>(undefined as never)
  let params = $ref<Mutable<CreateClientParams>>()
  const canStreaming = $computed(() => !!params?.streamingApiUrl)

  const setParams = (newParams: Partial<CreateClientParams>) => {
    const p = { ...params, ...newParams } as CreateClientParams
    client = createClient(p)
    params = p
  }

  return {
    client: $$(client),
    params: readonly($$(params)),
    canStreaming: $$(canStreaming),
    setParams,
  }
}
export type ElkMasto = ReturnType<typeof createMasto>

export const useMasto = () => useNuxtApp().$masto as ElkMasto
export const useMastoClient = () => useMasto().client.value

export function mastoLogin(masto: ElkMasto, user: Pick<UserLogin, 'server' | 'token'>) {
  const { setParams } = $(masto)

  const server = user.server
  const url = `https://${server}`
  const instance: ElkInstance = reactive(getInstanceCache(server) || { uri: server, accountDomain: server })
  setParams({
    url,
    accessToken: user?.token,
    disableVersionCheck: true,
    streamingApiUrl: instance?.urls?.streamingApi,
  })

  fetchV1Instance({ url }).then((newInstance) => {
    Object.assign(instance, newInstance)
    setParams({
      streamingApiUrl: newInstance.urls.streamingApi,
    })
    instanceStorage.value[server] = newInstance
  })

  return instance
}

interface UseStreamingOptions<Controls extends boolean> {
  /**
   * Expose more controls
   *
   * @default false
   */
  controls?: Controls
  /**
   * Connect on calling
   *
   * @default true
   */
  immediate?: boolean
}

export function useStreaming(
  cb: (client: mastodon.Client) => Promise<WsEvents>,
  options: UseStreamingOptions<true>,
): { stream: Ref<Promise<WsEvents> | undefined> } & Pausable
export function useStreaming(
  cb: (client: mastodon.Client) => Promise<WsEvents>,
  options?: UseStreamingOptions<false>,
): Ref<Promise<WsEvents> | undefined>
export function useStreaming(
  cb: (client: mastodon.Client) => Promise<WsEvents>,
  { immediate = true, controls }: UseStreamingOptions<boolean> = {},
): ({ stream: Ref<Promise<WsEvents> | undefined> } & Pausable) | Ref<Promise<WsEvents> | undefined> {
  const { canStreaming, client } = useMasto()

  const isActive = ref(immediate)
  const stream = ref<Promise<WsEvents>>()

  function pause() {
    isActive.value = false
  }

  function resume() {
    isActive.value = true
  }

  function cleanup() {
    if (stream.value) {
      stream.value.then(s => s.disconnect()).catch(() => Promise.resolve())
      stream.value = undefined
    }
  }

  watchEffect(() => {
    cleanup()
    if (canStreaming.value && isActive.value)
      stream.value = cb(client.value)
  })

  tryOnBeforeUnmount(() => isActive.value = false)

  if (controls)
    return { stream, isActive, pause, resume }
  else
    return stream
}
