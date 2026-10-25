import { stringifyQuery } from 'ufo'

import { DEFAULT_OAUTH_SCOPES } from '~/constants'

export default defineEventHandler(async (event) => {
  let { server } = getRouterParams(event)
  if (!server) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing server parameter.',
    })
  }
  const { origin, force_login, lang } = await readBody(event)
  server = server.toLocaleLowerCase().trim()
  const app = await getApp(origin, server)

  if (!app) {
    throw createError({
      statusCode: 400,
      statusMessage: `App not registered for server: ${server}`,
    })
  }

  const query = stringifyQuery({
    client_id: app.client_id,
    force_login: force_login === true ? 'true' : 'false',
    scope: DEFAULT_OAUTH_SCOPES,
    response_type: 'code',
    lang,
    redirect_uri: getRedirectURI(origin, server),
  })

  return `https://${server}/oauth/authorize?${query}`
})
