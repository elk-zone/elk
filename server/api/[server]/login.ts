import { stringifyQuery } from 'ufo'
import { getApp, getRedirectURI } from '~/server/shared'

export default defineEventHandler(async (event) => {
  const { server } = getRouterParams(event)
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
  const url = `https://${server}/oauth/authorize?${query}`

  await sendRedirect(event, url, 302)
})
