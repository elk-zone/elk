import Color from 'tinycolor2'
import type { CustomColors } from '~/types'

import { InjectionKeyCustomColors } from '~/constants/symbols'
import { COOKIE_KEY_CUSTOM_COLORS, COOKIE_MAX_AGE, DEFAULT_CUSTOM_COLORS } from '~/constants'

export default defineNuxtPlugin((nuxt) => {
  const cookieCustomColors = useCookie<CustomColors>(COOKIE_KEY_CUSTOM_COLORS, { default: () => DEFAULT_CUSTOM_COLORS, maxAge: COOKIE_MAX_AGE })
  nuxt.vueApp.provide(InjectionKeyCustomColors, cookieCustomColors)

  const bgBase = new Color(cookieCustomColors.value!['bg-base'])

  if (!process.server) {
    watchEffect(() => {
      Object.entries(cookieCustomColors.value!).forEach(([k, v]) => {
        document.documentElement.style.setProperty(`--c-${k}-custom`, v)
      })

      document.documentElement.style.setProperty('--c-bg-base-rgb-custom', `${bgBase.toRgb().r}, ${bgBase.toRgb().g}, ${bgBase.toRgb().b}`)
    })
  }
  else {
    useHead({
      style: [
        {
          innerHTML: `:root {
            ${Object.entries(cookieCustomColors.value!).map(([k, v]) => `--c-${k}-custom: ${v};`).join('\n')}
            --c-bg-base-rgb-custom: ${bgBase.toRgb().r}, ${bgBase.toRgb().g}, ${bgBase.toRgb().b};
          }`,
        },
      ],
    })
  }
})
