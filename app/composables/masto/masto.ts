import type { UserLogin } from '#shared/types'
import type { Pausable } from '@vueuse/core'
import type { mastodon } from 'masto'
import type { Ref } from 'vue'
import type { ElkInstance } from '../users'
import { createRestAPIClient, createStreamingAPIClient, MastoHttpError } from 'masto'

export function createMasto() {
  return {
    client: shallowRef<mastodon.rest.Client>(undefined as never),
    streamingClient: shallowRef<mastodon.streaming.Client | undefined>(),
  }
}
export type ElkMasto = ReturnType<typeof createMasto>

export function useMasto() {
  return useNuxtApp().$masto as ElkMasto
}
export function useMastoClient() {
  return useMasto().client.value
}

export function mastoLogin(masto: ElkMasto, user: Pick<UserLogin, 'server' | 'token'>) {
  const server = user.server
  const url = `https://${server}`
  const instance: ElkInstance = reactive(getInstanceCache(server) || { uri: server, accountDomain: server })
  const accessToken = user.token

  const createStreamingClient = (streamingApiUrl: string | undefined) => {
    return streamingApiUrl ? createStreamingAPIClient({ streamingApiUrl, accessToken, implementation: globalThis.WebSocket }) : undefined
  }

  const streamingApiUrl = instance?.configuration?.urls?.streaming
  masto.client.value = createRestAPIClient({ url, accessToken })
  masto.streamingClient.value = createStreamingClient(streamingApiUrl)

  // Refetch instance info in the background on login
  masto.client.value.v2.instance.fetch().catch(error => new Promise<mastodon.v2.Instance>((resolve, reject) => {
    if (error instanceof MastoHttpError && error.statusCode === 404) {
      return masto.client.value.v1.instance.fetch().then((newInstance) => {
        console.warn(`Instance ${server} on version ${newInstance.version} does not support "GET /api/v2/instance" API, try converting to v2 instance... expect some errors`)
        const v2Instance = {
          ...newInstance,
          domain: newInstance.uri,
          sourceUrl: '',
          usage: {
            users: {
              activeMonth: 0,
            },
          },
          icon: [],
          apiVersions: {
            mastodon: newInstance.version,
          },
          contact: {
            email: newInstance.email,
          },
          configuration: {
            ...(newInstance.configuration ?? {}),
            urls: {
              streaming: newInstance.urls.streamingApi,
            },
          },
        } as unknown as mastodon.v2.Instance
        return resolve(v2Instance)
      }).catch(reject)
    }

    return reject(error)
  })).then((newInstance) => {
    Object.assign(instance, newInstance)
    if (newInstance.configuration.urls.streaming !== streamingApiUrl)
      masto.streamingClient.value = createStreamingClient(newInstance.configuration.urls.streaming)

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
  cb: (client: mastodon.streaming.Client) => mastodon.streaming.Subscription,
  options: UseStreamingOptions<true>,
): { stream: Ref<mastodon.streaming.Subscription | undefined> } & Pausable
export function useStreaming(
  cb: (client: mastodon.streaming.Client) => mastodon.streaming.Subscription,
  options?: UseStreamingOptions<false>,
): Ref<mastodon.streaming.Subscription | undefined>
export function useStreaming(
  cb: (client: mastodon.streaming.Client) => mastodon.streaming.Subscription,
  { immediate = true, controls }: UseStreamingOptions<boolean> = {},
): ({ stream: Ref<mastodon.streaming.Subscription | undefined> } & Pausable) | Ref<mastodon.streaming.Subscription | undefined> {
  const { streamingClient } = useMasto()

  const isActive = ref(immediate)
  const stream = ref<mastodon.streaming.Subscription>()

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
