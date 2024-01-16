import type { mastodon } from 'masto'

interface ViewTransitionSources {
  status?: mastodon.v1.Status
  account?: mastodon.v1.Account
}

interface ViewTransitionState {
  targets: ViewTransitionSources
  setOnPath: string
}

function getViewTransitionState() {
  return useState<null | ViewTransitionState>('viewTransitionTargets', () => null)
}

export const viewTransitionStatusInjectionKey = Symbol('the status of the parent status card') as InjectionKey<mastodon.v1.Status>
export const viewTransitionAccountInjectionKey = Symbol('the account of the viewed profile') as InjectionKey<mastodon.v1.Account>

export function setViewTransitionTarget(targets: ViewTransitionSources) {
  getViewTransitionState().value = {
    targets: calcTransitionSources(targets),
    setOnPath: useRoute().path,
  }
}
interface ViewTransitionSources {
  status?: mastodon.v1.Status
  account?: mastodon.v1.Account
}

export function getViewTransitionStyles(viewTransitionName: string, sources?: ViewTransitionSources) {
  return computed(() => {
    if (shouldTakePartInTransition(sources))
      return { 'view-transition-name': viewTransitionName }
    else
      return {}
  })
}

function shouldTakePartInTransition(manualSources?: ViewTransitionSources) {
  const state = getViewTransitionState().value
  if (!state || (!state.targets.account && !state.targets.status))
    return false

  const sources = calcTransitionSources({
    status: manualSources?.status || inject(viewTransitionStatusInjectionKey, undefined),
    account: manualSources?.account || inject(viewTransitionAccountInjectionKey, undefined),
  })

  const route = useRoute()
  const currPath = route.path
  const onProfilePage = route.name === 'account-index'
  const arrivingOnProfile = state?.setOnPath !== currPath && onProfilePage

  if (arrivingOnProfile) {
    if (sources.account && !sources.status)
      return state.targets.account?.id === sources.account.id
  }
  else {
    if (state.targets.account && state.targets.account.id !== sources.account?.id)
      return false

    if (state.targets.status && state.targets.status.id !== sources.status?.id)
      return false

    return true
  }
}

function calcTransitionSources(sources: ViewTransitionSources): ViewTransitionSources {
  return {
    status: sources.status,
    account: sources.account || sources.status?.account,
  }
}
