import { getQuery } from 'ufo'

export default defineEventHandler(async (event) => {
  const query = getQuery(event.req.url!)
  const code = query.code
  const server = event.context.params.server
  console.log({ query, server })

  const res = await $fetch(`https://${server}/oauth/token`, {
    method: 'POST',
    body: {
      client_id: 'your_client_id_here',
      client_secret: 'your_client_secret_here',
      redirect_uri: 'urn:ietf:wg:oauth:2.0:oob',
      grant_type: 'authorization_code',
      code,
      scope: 'read write follow push',
    },
  })
  console.log({ res })
})
