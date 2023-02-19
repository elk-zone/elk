import type { EventContext, KVNamespace, PagesFunction } from '@cloudflare/workers-types'
import { createApplication, getRedirectURI, readApplication } from '../../shared'

interface Env {
  STORAGE: KVNamespace
  NODE_ENV: string
}

export const onRequestPost: PagesFunction<Env> = async (context: EventContext): Response | Promise<Response> => {
  const { origin, force_login } = await context.request.json()
  if ((context?.env?.NODE_ENV === undefined) || ((origin.startsWith('https:') === false) && (['development', 'canary', 'staging'].includes(context.env?.NODE_ENV) === false)))
    return new Response('Production environments must use HTTPS/TLS', { status: 403 })

  const server: string = context.params.server.toLocaleLowerCase().trim()

  try {
    let app = await readApplication(origin, server, context.env.STORAGE)

    if (!app) {
      app = await createApplication(origin, server, context.env.STORAGE)
      if (!app) {
        const m = 'Unable to register the application'
        console.error(m)
        return new Response (m, { status: 422 })
      }
    }

    const requestParams = new URLSearchParams()
    requestParams.append('client_id', app.client_id)
    requestParams.append('scope', 'read write push')
    requestParams.append('redirect_uri', getRedirectURI(origin, server))
    requestParams.append('response_type', 'code')
    requestParams.append('force_login', force_login !== false ? 'true' : 'false')
    const requestURL = new URL(`https://${server}/oauth/authorize?${requestParams.toString()}`)
    return new Response(requestURL, { status: 200 })
  }
  catch (reason: EvalError) {
    console.error(`reason.message: ${reason.message}`)
    return new Response (`App not registered for server: ${server}`, { status: 400 })
  }
}
