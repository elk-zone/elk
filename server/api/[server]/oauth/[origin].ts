import { stringifyQuery } from 'ufo'

import { defaultUserAgent } from '~/server/utils/shared'

export default defineEventHandler(async (event) => {
  let { server, origin } = getRouterParams(event)
  server = server.toLocaleLowerCase().trim()
  origin = decodeURIComponent(origin)
  const app = await getApp(origin, server)

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

  try {
    const result: any = await $fetch(`https://${server}/oauth/token`, {
      method: 'POST',
      headers: {
        'user-agent': defaultUserAgent,
      },
      body: {
        client_id: app.client_id,
        client_secret: app.client_secret,
        redirect_uri: getRedirectURI(origin, server),
        grant_type: 'authorization_code',
        code,
        scope: 'read write follow push',
      },
      retry: 3,
    })

    const url = `/signin/callback?${stringifyQuery({ server, token: result.access_token, vapid_key: app.vapid_key })}`
    await sendRedirect(event, url, 302)
  }
  catch {
    throw createError({
      statusCode: 400,
      statusMessage: 'Could not complete log in.',
    })
  }
})
