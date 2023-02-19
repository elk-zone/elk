import type { EventContext, KVNamespace, PagesFunction } from '@cloudflare/workers-types'
import { deleteApplication } from '../../shared'

interface Env {
  STORAGE: KVNamespace
  NODE_ENV: string
  NUXT_ADMIN_KEY: string
}

export const onRequestGet: PagesFunction<Env> = async (context: EventContext): Response | Promise<Response> => {
  const url: URL = new URL(context.request.url)
  const origin: string = url.origin
  if ((context?.env?.NODE_ENV === undefined) || ((origin.startsWith('https:') === false) && (['development', 'canary', 'staging'].includes(context.env?.NODE_ENV) === false)))
    return new Response('Production environments must use HTTPS/TLS', { status: 403 })

  if (!context.env?.NUXT_ADMIN_KEY) {
    const m = 'NUXT_ADMIN_KEY is not set, but is required to perform this action'
    console.error(m)
    return new Response (m, { status: 401 })
  }

  const server: string = context.params.server.toLocaleLowerCase().trim()
  const key: string = url.searchParams.get('key')

  if (key === context.env.NUXT_ADMIN_KEY) {
    const result: boolean = await deleteApplication(origin, server, context.env.STORAGE)
    if (result === true) {
      return new Response(JSON.stringify({ status: true }), { status: 200 })
    }
    else {
      console.error('Unable to delete application')
      return new Response(JSON.stringify({ status: false }), { status: 500 })
    }
  }
  else {
    const m = 'Invalid NUXT_ADMIN_KEY'
    console.error(m)
    return new Response (m, { status: 401 })
  }
}
