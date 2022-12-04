export default defineNuxtRouteMiddleware(async (to, from) => {
  if (!('server' in to.params))
    return

  if (!currentUser.value) {
    if (from.params.server !== to.params.server) {
      await loginTo({
        server: to.params.server as string,
      })
    }
    return
  }

  // No need to additionally resolve an id if we're already logged in
  if (currentUser.value.server === to.params.server)
    return

  // Tags don't need to be redirected to a local id
  if (to.params.tag)
    return

  // Handle redirecting to new permalink structure for users with old links
  if (!to.params.server) {
    return {
      ...to,
      params: {
        ...to.params,
        server: currentUser.value.server,
      },
    }
  }

  try {
    // If we're logged in, search for the local id the account or status corresponds to
    const { value } = await useMasto().search({ q: `https:/${to.fullPath}`, resolve: true, limit: 1 }).next()

    const { accounts, statuses } = value
    if (statuses[0])
      return getStatusRoute(statuses[0])

    if (accounts[0])
      return getAccountRoute(accounts[0])
  }
  catch {}

  return '/home'
})
