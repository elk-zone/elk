import { defineNuxtModule } from '@nuxt/kit'
import { check } from 'stale-dep'

export default defineNuxtModule({
  meta: {
    name: 'stale-dep',
  },
  setup() {
    return check('pnpm')
  },
})
