import { defineNuxtModule } from '@nuxt/kit'
import { check } from 'stale-dep'

export default defineNuxtModule({
  meta: {
    name: 'stale-dep',
    configKey: 'staleDep',
  },
  defaults: {
    enabled: process.env.NODE_ENV !== 'test',
  },
  setup(opts) {
    if (opts.enabled)
      return check('pnpm')
  },
})
