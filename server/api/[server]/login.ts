import { stringifyQuery } from 'ufo'
import { HOST_URL, getApp } from '~/server/shared'

export default defineEventHandler(async (event) => {
  const server = event.context.params.server
  const app = await getApp(server)

  if (!app) {
    event.node.res.statusCode = 400
    return `App not registered for server: ${server}`
  }

  const query = stringifyQuery({
    client_id: app.client_id,
    scope: 'read write follow push',
    redirect_uri: `${HOST_URL}/api/${server}/oauth`,
    response_type: 'code',
  })
  const url = `https://${server}/oauth/authorize?${query}`

  await sendRedirect(event, url, 302)
})
