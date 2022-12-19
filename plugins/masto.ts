import type { MastoClient } from 'masto'
import type { ElkMasto } from '~/types'

export default defineNuxtPlugin(async (nuxtApp) => {
  const api = shallowRef<MastoClient | null>(null)
  const apiPromise = ref<Promise<MastoClient> | null>(null)
  const initialised = computed(() => !!api.value)

  const masto = new Proxy({} as ElkMasto, {
    get(_, key: keyof ElkMasto) {
      if (key === 'loggedIn')
        return initialised

      if (key === 'loginTo') {
        return (...args: any[]): Promise<MastoClient> => {
          apiPromise.value = loginTo(...args).then((r) => {
            api.value = r
            return masto
          }).catch(() => {
            // Show error page when Mastodon server is down
            throw createError({
              fatal: true,
              statusMessage: 'Could not log into account.',
            })
          })
          return apiPromise.value
        }
      }

      if (api.value && key in api.value)
        return api.value[key as keyof MastoClient]

      if (!api.value) {
        return new Proxy({}, {
          get(_, subkey) {
            return (...args: any[]) => apiPromise.value?.then((r: any) => r[key][subkey](...args))
          },
        })
      }
    },
  })

  if (process.client) {
    const { query } = useRoute()
    const user = typeof query.server === 'string' && typeof query.token === 'string'
      ? {
          server: query.server,
          token: query.token,
          vapidKey: typeof query.vapid_key === 'string' ? query.vapid_key : undefined,
        }
      : currentUser.value

    nuxtApp.hook('app:suspense:resolve', () => {
      // TODO: improve upstream to make this synchronous (delayed auth)
      masto.loginTo(user)
    })
  }

  return {
    provide: {
      masto,
    },
  }
})
