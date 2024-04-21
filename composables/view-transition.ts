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

export function getIsViewTransitionInProgress() {
  return useState<boolean>('isVewTransitionFinished', () => false)
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
  const onAccountPage = route.name?.toString().startsWith('account-')
  const arrivingOnProfile = onAccountPage && state.setOnPath !== route.path

  if (arrivingOnProfile) {
    return !sources.status && state.targets.account!.id === sources.account?.id
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
