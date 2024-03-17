import type { mastodon } from 'masto'
import type { ViewTransition } from '#app/plugins/view-transitions.client'

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

export function getIsViewTransitionFinished() {
  return useState<boolean>('isVewTransitionFinished', () => true)
}

export const viewTransitionEnabledInjectionKey: InjectionKey<boolean> = Symbol('whether view-transition is enabled for this component')
export const viewTransitionStatusInjectionKey: InjectionKey<undefined | mastodon.v1.Status> = Symbol('the status in context')
export const viewTransitionAccountInjectionKey: InjectionKey<undefined | mastodon.v1.Account> = Symbol('the account in context')

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
  const isEnabledInContext = inject(viewTransitionEnabledInjectionKey, false)
  if (!isEnabledInContext)
    return {}

  const calcedSources = calcTransitionSources({
    status: sources?.status || inject(viewTransitionStatusInjectionKey, undefined),
    account: sources?.account || inject(viewTransitionAccountInjectionKey, undefined),
  })

  return computed(() => {
    const isEnabledInPreferences = usePreferences('experimentalViewTransitions').value
    if (!isEnabledInPreferences || !shouldTakePartInTransition(calcedSources))
      return {}

    return { 'view-transition-name': viewTransitionName }
  })
}

function shouldTakePartInTransition(sources: ViewTransitionSources) {
  const state = getViewTransitionState().value
  if (!state?.targets.account && !state?.targets.status)
    return false

  const route = useRoute()
  const currPath = route.path
  const onProfilePage = route.name === 'account-index'
  const arrivingOnProfile = state?.setOnPath !== currPath && onProfilePage

  if (arrivingOnProfile) {
    if (sources.account && !sources.status) // the navigation source was an avatar not a status
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
