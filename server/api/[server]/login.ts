import { stringifyQuery } from 'ufo'
import { createError, defineEventHandler, getRouterParams, readBody } from 'h3'
import { getApp, getRedirectURI } from '~/server/shared'

export default defineEventHandler(async (event) => {
  let { server } = getRouterParams(event)
  const { origin, force_login } = await readBody(event)
  server = server.toLocaleLowerCase().trim()
  const app = await getApp(origin, server)

  if (!app) {
    throw createError({
      statusCode: 400,
      statusMessage: `App not registered for server: ${server}`,
    })
  }

  const query = stringifyQuery({
    client_id: app.client_id,
    force_login: force_login === true ? 'true' : 'false',
    scope: 'read write follow push',
    redirect_uri: getRedirectURI(origin, server),
    response_type: 'code',
  })

  return `https://${server}/oauth/authorize?${query}`
})
