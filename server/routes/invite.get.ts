const query = (accessToken: string, query: string) =>
  $fetch<{ data: any }>('https://api.github.com/graphql', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
    body: { query },
  })

export default defineEventHandler(async (event) => {
  const { code } = getQuery(event)

  const config = useRuntimeConfig()

  if (!code) {
    const redirect = `&redirect_uri=${config.deployUrl}/invite`
    const loginURL = `https://github.com/login/oauth/authorize?client_id=${config.github.clientId}${redirect}`
    await sendRedirect(event, loginURL)
    return
  }

  const { access_token } = await $fetch<{ access_token: string }>(
    'https://github.com/login/oauth/access_token',
    {
      method: 'POST',
      body: {
        client_id: config.github.clientId,
        client_secret: config.github.clientSecret,
        code,
      },
    },
  )

  if (!access_token) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Authorisation code invalid.',
    })
  }

  const id = await query(access_token, '{ viewer { databaseId } }')
    .then(r => r.data?.viewer.databaseId)

  if (!id) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Access code invalid.',
    })
  }

  await $fetch(
    'https://api.github.com/orgs/elk-zone/invitations',
    {
      method: 'POST',
      body: { invitee_id: id, role: 'direct_member', team_ids: [7042932] },
      headers: {
        'Accept': 'application/vnd.github+json',
        'Authorization': `Bearer ${config.github.inviteToken}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
    },
  )

  return sendRedirect(
    event,
    config.discord.inviteUrl,
  )
})
