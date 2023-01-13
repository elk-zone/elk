import type { SetupContext } from './setupCtx'
import type { TransformContext } from './transform'

export type ElkPluginHooks = Record<string, (...args: any[]) => any>

export interface ElkPlugin<
  Hooks extends ElkPluginHooks,
> {
  name: string
  transform?: (ctx: TransformContext<Hooks>) => void
  setup?: (ctx: SetupContext<Hooks>) => void
}

export function defineElkPlugin<
  Hooks extends ElkPluginHooks = {},
>(plugin: ElkPlugin<Hooks>) {
  return plugin
}
