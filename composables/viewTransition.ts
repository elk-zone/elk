interface ViewTransitionTargets {
  statusId: null | string
  accountId: null | string
}

export function getViewTransitionTargets() {
  return useState('viewTransitionTargets', () => ({
    statusId: null,
    accountId: null,
  } as ViewTransitionTargets))
}
