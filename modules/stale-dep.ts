import { defineNuxtModule } from '@nuxt/kit'
import { check } from 'stale-dep'

export default defineNuxtModule({
  meta: {
    name: 'stale-dep',
    configKey: 'staleDep',
  },
  defaults: {
    enabled: true,
  },
  setup(opts) {
    if (opts.enabled)
      return check('pnpm')
  },
})
