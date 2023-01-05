import type { CustomColors } from '~/types'
import { InjectionKeyCustomColors } from '~/constants/symbols'
import { COOKIE_KEY_CUSTOM_COLORS, COOKIE_MAX_AGE } from '~/constants'

export default defineNuxtPlugin((nuxt) => {
  const cookieCustomColors = useCookie<CustomColors>(COOKIE_KEY_CUSTOM_COLORS, { default: () => ({ primary: '#d98018' }), maxAge: COOKIE_MAX_AGE })
  nuxt.vueApp.provide(InjectionKeyCustomColors, cookieCustomColors)

  if (!process.server) {
    watchEffect(() => {
      Object.entries(cookieCustomColors.value!).forEach(([k, v]) => {
        document.documentElement.style.setProperty(`--c-${k}-custom`, v)
      })
    })
  }
  else {
    useHead({
      style: [
        {
          innerHTML: `:root { ${Object.entries(cookieCustomColors.value!).map(([k, v]) => `--c-${k}-custom: ${v};`).join(' ')} }`,
        },
      ],
    })
  }
})
