import { stringifyQuery } from 'vue-router'
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

  const { code } = getQuery(event)
  if (!code) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Missing authentication code.',
    })
  }

  const result: any = await $fetch(`https://${server}/oauth/token`, {
    method: 'POST',
    body: {
      client_id: app.client_id,
      client_secret: app.client_secret,
      redirect_uri: getRedirectURI(server),
      grant_type: 'authorization_code',
      code,
      scope: 'read write follow push',
    },
  })

  const url = `/signin/callback?${stringifyQuery({ server, token: result.access_token })}`
  await sendRedirect(event, url, 302)
})
