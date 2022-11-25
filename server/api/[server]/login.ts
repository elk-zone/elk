import { stringifyQuery } from 'ufo'
import { HOST_DOMAIN, getApp } from '~/server/shared'

export default defineEventHandler(async ({ context, res }) => {
  const server = context.params.server
  const app = await getApp(HOST_DOMAIN, server)

  if (!app) {
    res.statusCode = 400
    return `App not registered for server: ${server}`
  }

  const query = stringifyQuery({
    client_id: app.client_id,
    scope: 'read write follow push',
    redirect_uri: `${HOST_DOMAIN}/api/${server}/oauth`,
    response_type: 'code',
  })
  const url = `https://${server}/oauth/authorize?${query}`

  res.writeHead(302, {
    Location: url,
  })
  res.end()
})
