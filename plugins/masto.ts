export default defineNuxtPlugin({
  enforce: 'pre',
  parallel: import.meta.server,
  setup() {
    const { params, query } = useRoute()

    publicServer.value = params.server as string || useRuntimeConfig().public.defaultServer

    const masto = createMasto()
    const user = (typeof query.server === 'string' && typeof query.token === 'string')
      ? {
          server: query.server,
          token: query.token,
          vapidKey: typeof query.vapid_key === 'string' ? query.vapid_key : undefined,
        }
      : (currentUser.value || { server: publicServer.value })

    if (import.meta.client)
      loginTo(masto, user)

    return {
      provide: {
        masto,
      },
    }
  },
})
