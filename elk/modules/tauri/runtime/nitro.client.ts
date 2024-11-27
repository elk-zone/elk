import type { FetchResponse } from 'ofetch'
import {
  createApp,
  createRouter,
  defineLazyEventHandler,
  toNodeListener,
} from 'h3'
import { createFetch } from 'ofetch'
import {
  createCall,
  createFetch as createLocalFetch,
} from 'unenv/runtime/fetch/index'

const handlers = [
  {
    route: '/api/:server/oauth',
    handler: defineLazyEventHandler(() => import('~/server/api/[server]/oauth/[origin]').then(r => r.default || r)),
  },
  {
    route: '/api/:server/login',
    handler: defineLazyEventHandler(() => import('~/server/api/[server]/login').then(r => r.default || r)),
  },
  {
    route: '/api/list-servers',
    handler: defineLazyEventHandler(() => import('~/server/api/list-servers').then(r => r.default || r)),
  },
]

// @ts-expect-error undeclared global window property
window.__NUXT__.config = {
  // @ts-expect-error undeclared global window property
  ...window.__NUXT__.config,
  storage: {},
}

export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig()

  const h3App = createApp({
    debug: import.meta.dev,
    // TODO: add global error handler
    // onError: (err, event) => {
    //  console.log({ err, event })
    // },
  })

  const router = createRouter()

  for (const h of handlers)
    router.use(h.route, h.handler)

  // @ts-expect-error TODO: fix
  h3App.use(config.app.baseURL, router)

  const localCall = createCall(toNodeListener(h3App) as any)
  const localFetch = createLocalFetch(localCall, globalThis.fetch)

  // @ts-expect-error error types are subtly different here in a future nitro version
  globalThis.$fetch = createFetch({
    // @ts-expect-error slight differences in api
    fetch: localFetch,
    Headers,
    defaults: { baseURL: config.app.baseURL },
  })

  const route = useRoute()
  if (route.path.startsWith('/api')) {
    const result = (await ($fetch.raw as any)(route.fullPath)) as FetchResponse<unknown>
    if (result.headers.get('location'))
      location.href = result.headers.get('location')!
  }
})
