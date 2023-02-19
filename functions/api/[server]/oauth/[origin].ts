import type { EventContext, KVNamespace, PagesFunction } from '@cloudflare/workers-types'
import { createToken } from '../../../shared'

interface Env {
  STORAGE: KVNamespace
  NODE_ENV: string
}

export const onRequestGet: PagesFunction<Env> = async (context: EventContext): Response | Promise<Response> => {
  const origin: string = decodeURIComponent(context.params.origin)
  if ((context?.env?.NODE_ENV === undefined) || ((origin.startsWith('https:') === false) && (['development', 'canary', 'staging'].includes(context.env?.NODE_ENV) === false)))
    return new Response('Production environments must use HTTPS/TLS', { status: 403 })

  const requestURL: URL = new URL(context.request.url)
  const requestOrigin: string = requestURL.origin
  if (requestOrigin !== origin) {
    console.error([
      '!!! SUSPICIOUS ACTIVITY !!!',
      `requestOrigin !== origin: ${requestOrigin} !== ${origin}`,
      `Request URL: ${context.request.url}`,
      `x-real-ip: ${context.headers?.get('x-real-ip')}`,
      `x-forwarded-for: ${context.headers?.get('x-forwarded-for')}`,
      `cf-connecting-ip: ${context.headers?.get('cf-connecting-ip')}`,
      `longitude: ${context.request.cf.longitude}`,
      `latitude: ${context.request.cf.latitude}`,
    ])
    return new Response ('Forbidden', { status: 403 })
  }

  const code: string = requestURL.searchParams?.get('code')
  if (!code)
    return new Response ('Missing authentication code', { status: 422 })

  const server: string = context.params.server.toLocaleLowerCase().trim()

  const redirectPath = await createToken(origin, server, context.env.STORAGE, code)
  if (!redirectPath)
    return Response.error('Unable to log in')

  return Response.redirect(`${requestURL.protocol}//${requestURL.host}${redirectPath}`, 302)
}
