import { stringifyQuery } from 'vue-router'
import { HOST_DOMAIN, getApp } from '~/server/shared'

export default defineEventHandler(async (event) => {
  const server = event.context.params.server
  const app = await getApp(HOST_DOMAIN, server)

  if (!app) {
    setResponseStatus(400)
    return `App not registered for server: ${server}`
  }

  const { code } = getQuery(event)

  const result: any = await $fetch(`https://${server}/oauth/token`, {
    method: 'POST',
    body: {
      client_id: app.client_id,
      client_secret: app.client_secret,
      redirect_uri: `${HOST_DOMAIN}/api/${server}/oauth`,
      grant_type: 'authorization_code',
      code,
      scope: 'read write follow push',
    },
  })

  const url = `${HOST_DOMAIN}/signin/callback?${stringifyQuery({ server, token: result.access_token })}`
  await sendRedirect(event, url, 302)
})
