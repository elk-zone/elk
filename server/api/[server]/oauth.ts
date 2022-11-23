import { getQuery } from 'ufo'
import { stringifyQuery } from 'vue-router'
import { getApp } from '~/server/shared'
import { HOST_DOMAIN } from '~/constants'

export default defineEventHandler(async ({ context, req, res }) => {
  const server = context.params.server
  const app = await getApp(server)

  if (!app) {
    res.statusCode = 400
    return `App not registered for server: ${server}`
  }

  const query = getQuery(req.url!)
  const code = query.code

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

  res.writeHead(302, {
    Location: `${HOST_DOMAIN}/signin/callback?${stringifyQuery({ server, token: result.access_token })}`,
  })
  res.end()

  return result
})
