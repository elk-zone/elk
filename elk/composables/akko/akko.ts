import type { akkoma } from '@bdxtown/akko'
import type { Pausable } from '@vueuse/core'
import type { Ref } from 'vue'
import type { ElkInstance } from '../users'
import type { UserLogin } from '~/types'
import { createRestAPIClient, createStreamingAPIClient } from '@bdxtown/akko'
import { STORAGE_KEY_CLIENT_APP } from '~/constants'
import { name } from './../../package.json'

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

const SCOPES = 'read write follow push admin'

function getClientApp(domain: string) {
  const raw = useLocalStorage<string | undefined>(STORAGE_KEY_CLIENT_APP, undefined)
  if (!raw.value)
    return undefined
  const clientApp = JSON.parse(raw.value)
  return clientApp[domain] || undefined
}

function setClientApp(domain: string, clientApp: akkoma.v1.Client) {
  const raw = useLocalStorage<string | undefined>(STORAGE_KEY_CLIENT_APP, undefined)
  if (!raw.value) {
    raw.value = JSON.stringify({
      [domain]: clientApp,
    })
    return
  }
  const data = JSON.parse(raw.value)
  data[domain] = clientApp
  raw.value = JSON.stringify(data)
}

export async function createApp(domain: string) {
  const clientApp = getClientApp(domain)
  if (clientApp)
    return clientApp

  const client = createRestAPIClient({ url: `https://${domain}` })
  const app = await client.v1.apps.create({
    clientName: name,
    redirectUris: `${window.location.protocol}//${window.location.host}/${domain}/login`,
    scopes: SCOPES,
    website: `${window.location.protocol}//${window.location.host}`,
  })
  setClientApp(domain, app)
  return app
}

export async function redirectToInstanceLogin(client: akkoma.v1.Client, domain: string) {
  const query = new URLSearchParams({
    client_id: client.clientId as string,
    redirect_uri: `${window.location.protocol}//${window.location.host}/${domain}/login`,
    response_type: 'code',
    scopes: SCOPES,
  })

  window.location.href = `https://${domain}/oauth/authorize?${query.toString()}`
}

export async function retrieveAccessToken(domain: string, code: string) {
  const client = getClientApp(domain)
  if (!client)
    throw new Error('Missing client')

  const response = await fetch(`https://${domain}/oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: client.clientId,
      client_secret: client.clientSecret,
      redirect_uri: `${window.location.protocol}//${window.location.host}/${domain}/login`,
      grant_type: 'authorization_code',
      code,
      scope: SCOPES,
    }),
  })

  const token: { access_token: string } = await response.json()
  const akko = useAkko()

  await loginTo(akko, {
    server: domain,
    token: token.access_token,
  })

  const router = useRouter()
  router.push({ path: '/', force: true })
}
