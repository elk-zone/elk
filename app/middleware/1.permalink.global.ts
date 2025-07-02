export default defineNuxtRouteMiddleware(async (to, from) => {
  if (import.meta.server)
    return

  if (!('server' in to.params))
    return

  const server = to.params.server as string || currentServer.value
  const user = currentUser.value
  const masto = useMasto()
  if (!user) {
    const fromServer = from.params.server || currentServer.value
    if (fromServer !== server)
      loginTo(masto, { server })
    return
  }

  // No need to additionally resolve an id if we're already logged in
  if (user.server === server)
    return

  // Tags don't need to be redirected to a local id
  if (to.params.tag)
    return

  // Handle redirecting to new permalink structure for users with old links
  if (!useRuntimeConfig().public.singleInstance && !to.params.server) {
    return {
      ...to,
      params: {
        ...to.params,
        server: user.server,
      },
    }
  }

  try {
    // If we're already on an account page, we can search for this on the new instance
    if (to.params.account && to.name !== 'status' && to.params.account.includes('@')) {
      const account = await fetchAccountByHandle(to.params.account as string)
      if (account)
        return getAccountRoute(account)
    }

    // If we're logged in, search for the local id the account or status corresponds to
    const paginator = masto.client.value.v2.search.list({ q: `https:/${to.fullPath}`, resolve: true, limit: 1 })
    const { accounts, statuses } = (await paginator.next()).value ?? { accounts: [], statuses: [] }

    if (statuses[0])
      return getStatusRoute(statuses[0])

    if (accounts[0])
      return getAccountRoute(accounts[0])
  }
  catch (err) {
    console.error(err)
  }

  return '/home'
})
