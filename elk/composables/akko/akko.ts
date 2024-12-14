import type { Pausable } from '@vueuse/core'
import type { akkoma } from 'akko'
import type { Ref } from 'vue'
import type { ElkInstance } from '../users'
import { createRestAPIClient, createStreamingAPIClient } from 'akko'
import type { UserLogin } from '~/types'

export function createMasto() {
  return {
    client: shallowRef<akkoma.rest.Client>(undefined as never),
    streamingClient: shallowRef<akkoma.streaming.Client | undefined>(),
  }
}
export type ElkMasto = ReturnType<typeof createMasto>

export function useAkko() {
  return useNuxtApp().$masto as ElkMasto
}
export function useAkkoClient() {
  return useAkko().client.value
}

export function mastoLogin(masto: ElkMasto, user: Pick<UserLogin, 'server' | 'token'>) {
  const server = user.server
  const url = `https://${server}`
  const instance: ElkInstance = reactive(getInstanceCache(server) || { uri: server, accountDomain: server })
  const accessToken = user.token

  const createStreamingClient = (streamingApiUrl: string | undefined) => {
    return streamingApiUrl ? createStreamingAPIClient({ streamingApiUrl, accessToken, implementation: globalThis.WebSocket }) : undefined
  }

  const streamingApiUrl = instance?.urls?.streamingApi
  masto.client.value = createRestAPIClient({ url, accessToken })
  masto.streamingClient.value = createStreamingClient(streamingApiUrl)

  // Refetch instance info in the background on login
  masto.client.value.v1.instance.fetch().then((newInstance) => {
    Object.assign(instance, newInstance)
    if (newInstance.urls.streamingApi !== streamingApiUrl)
      masto.streamingClient.value = createStreamingClient(newInstance.urls.streamingApi)

    instanceStorage.value[server] = newInstance as ElkInstance
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
  cb: (client: akkoma.streaming.Client) => akkoma.streaming.Subscription,
  options: UseStreamingOptions<true>,
): { stream: Ref<akkoma.streaming.Subscription | undefined> } & Pausable
export function useStreaming(
  cb: (client: akkoma.streaming.Client) => akkoma.streaming.Subscription,
  options?: UseStreamingOptions<false>,
): Ref<akkoma.streaming.Subscription | undefined>
export function useStreaming(
  cb: (client: akkoma.streaming.Client) => akkoma.streaming.Subscription,
  { immediate = true, controls }: UseStreamingOptions<boolean> = {},
): ({ stream: Ref<akkoma.streaming.Subscription | undefined> } & Pausable) | Ref<akkoma.streaming.Subscription | undefined> {
  const { streamingClient } = useAkko()

  const isActive = ref(immediate)
  const stream = ref<akkoma.streaming.Subscription>()

  function pause() {
    isActive.value = false
  }

  function resume() {
    isActive.value = true
  }

  function cleanup() {
    if (stream.value) {
      stream.value.unsubscribe()
      stream.value = undefined
    }
  }

  watchEffect(() => {
    cleanup()
    if (streamingClient.value && isActive.value)
      stream.value = cb(streamingClient.value)
  })

  if (import.meta.client && !process.test)
    useNuxtApp().$pageLifecycle.addFrozenListener(cleanup)

  tryOnBeforeUnmount(() => isActive.value = false)

  if (controls)
    return { stream, isActive, pause, resume }
  else
    return stream
}
