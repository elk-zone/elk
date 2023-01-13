import { types } from 'recast'
import { createEventHook } from '@vueuse/core'
import type { analyze } from 'periscopic'
import type { OnASTCallback } from './mixin'
import { Mixin } from './mixin'
import type { ElkPluginHooks } from '.'
import N = types.namedTypes

export interface TransformASTPayload {
  id: string
  ast: N.File
  periscopic: ReturnType<typeof analyze>
  usedNames: Set<string>
  getSafeName: (baseName: string, forbiddenNames: Set<string> | null) => string
}

export class TransformContext<Hooks extends ElkPluginHooks> {
  transformAST = createEventHook<TransformASTPayload>()

  mixin(id: string): Mixin<Hooks> {
    const onAST = (cb: OnASTCallback) => {
      this.transformAST.on((payload) => {
        if (payload.id === id)
          cb(payload)
      })
    }
    return new Mixin(id, onAST)
  }
}
