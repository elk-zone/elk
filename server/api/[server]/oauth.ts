import { getQuery } from 'ufo'
import { getApp } from '~/server/shared'

export default defineEventHandler(async (event) => {
  const server = event.context.params.server
  const app = await getApp(server)

  if (!app) {
    event.res.statusCode = 400
    return `App not registered for server: ${server}`
  }

  const query = getQuery(event.req.url!)
  const code = query.code

  const res = await $fetch(`https://${server}/oauth/token`, {
    method: 'POST',
    body: {
      client_id: app.client_id,
      client_secret: app.client_secret,
      redirect_uri: 'urn:ietf:wg:oauth:2.0:oob',
      grant_type: 'authorization_code',
      code,
      scope: 'read write follow push',
    },
  })

  console.log({ res })
})
