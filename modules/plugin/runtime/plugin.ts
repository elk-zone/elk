import { createHookTarget } from '../utils'
import testPlugin from '../example/test'
import { SetupContext } from '../kit/setupCtx'
import { setHookTarget } from './hook'

export default defineNuxtPlugin(async (nuxt) => {
  const hookTarget = createHookTarget()
  setHookTarget(hookTarget)

  const ctx = new SetupContext(hookTarget)
  testPlugin.setup?.(ctx)
})
