import type { ElkPluginHooks } from '../kit'
import type { HookTarget } from '../utils'

declare global {
  // eslint-disable-next-line vars-on-top, no-var
  var __ep_t: HookTarget | undefined
}

export function setHookTarget(t: HookTarget) {
  globalThis.__ep_t = t
}

export function getHookTarget() {
  return globalThis.__ep_t
}

export function callHook<K extends keyof ElkPluginHooks>(
  hook: K,
  ...args: Parameters<ElkPluginHooks[K]>
) {
  if (!globalThis.__ep_t) {
    if (import.meta.env.DEV)
      console.warn(`[Elk Plugin] No hook target found when calling ${hook}.`)
    return
  }

  globalThis.__ep_t.emit(hook, ...args)
}
