import { stringifyQuery } from 'ufo'
import { createError, defineEventHandler, getRouterParams } from 'h3'
import { getApp, getRedirectURI } from '~/server/shared'

export default defineEventHandler(async (event) => {
  let { server } = getRouterParams(event)
  server = server.toLocaleLowerCase().trim()
  const app = await getApp(server)

  if (!app) {
    throw createError({
      statusCode: 400,
      statusMessage: `App not registered for server: ${server}`,
    })
  }

  const query = stringifyQuery({
    client_id: app.client_id,
    scope: 'read write follow push',
    redirect_uri: getRedirectURI(server),
    response_type: 'code',
  })

  return `https://${server}/oauth/authorize?${query}`
})
