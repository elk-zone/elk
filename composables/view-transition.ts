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

export function setViewTransitionTarget(manualSources?: ViewTransitionSources) {
  const status = manualSources?.status || inject(viewTransitionStatusInjectionKey, undefined)
  const account = manualSources?.account || inject(viewTransitionAccountInjectionKey, undefined) || status?.account

  getViewTransitionState().value = {
    targets: {
      status,
      account,
    },
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
  if (!state)
    return false

  const sources = {
    status: manualSources?.status || inject(viewTransitionStatusInjectionKey, null),
    account: manualSources?.account || inject(viewTransitionAccountInjectionKey, null),
  }

  const route = useRoute()
  const currPath = route.path
  const onProfilePage = route.name === 'account-index'
  const arrivingOnProfile = state?.setOnPath !== currPath && onProfilePage

  if (arrivingOnProfile) {
    if (sources.account && !sources.status)
      return state?.targets.account?.id === sources.account.id
  }
  else {
    let key: keyof ViewTransitionSources
    for (key in state.targets) {
      if (!state.targets[key])
        continue

      if (!sources[key] || sources[key]!.id !== state.targets[key]!.id)
        return false
    }

    return true
  }
}
