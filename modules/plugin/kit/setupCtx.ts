import type { HookTarget } from '../utils'
import type { ElkPluginHooks } from '.'

export class SetupContext<
  Hooks extends ElkPluginHooks,
> {
  private hookTarget
  constructor(hookTarget: HookTarget<Hooks>) {
    this.hookTarget = hookTarget
  }

  onHook<K extends keyof Hooks>(hook: K, fn: Hooks[K]) {
    const off = this.hookTarget.on(hook, fn)
    tryOnScopeDispose(off)
  }
}
