import { stringifyQuery } from 'ufo'

import { defaultUserAgent, invalidateApp } from '~~/server/utils/shared'

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
  catch (error: any) {
    // Check for invalid client error (OAuth app deleted)
    if (error?.data?.error === 'invalid_client'
      || (error?.statusCode === 401 && error?.data?.error_description?.includes('Client authentication failed'))) {
      // Invalidate cached app and retry once
      await invalidateApp(origin, server)

      try {
        const newApp = await getApp(origin, server)
        if (!newApp) {
          throw createError({
            statusCode: 400,
            statusMessage: `Failed to re-register app for server: ${server}`,
          })
        }

        const retryResult: any = await $fetch(`https://${server}/oauth/token`, {
          method: 'POST',
          headers: {
            'user-agent': defaultUserAgent,
          },
          body: {
            client_id: newApp.client_id,
            client_secret: newApp.client_secret,
            redirect_uri: getRedirectURI(origin, server),
            grant_type: 'authorization_code',
            code,
            scope: 'read write follow push',
          },
          retry: 1,
        })

        const url = `/signin/callback?${stringifyQuery({ server, token: retryResult.access_token, vapid_key: newApp.vapid_key })}`
        await sendRedirect(event, url, 302)
        return
      }
      catch {
        throw createError({
          statusCode: 400,
          statusMessage: 'OAuth application recovery failed. Please try again.',
        })
      }
    }

    // Other errors (network, invalid code, etc.)
    throw createError({
      statusCode: 400,
      statusMessage: 'Could not complete log in.',
    })
  }
})
