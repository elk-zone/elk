import type { FontSize } from '~/types'
import { InjectionKeyFontSize } from '~/constants/symbols'
import { COOKIE_KEY_FONT_SIZE, COOKIE_MAX_AGE } from '~/constants'
import { fontSizeMap } from '~/constants/options'

export default defineNuxtPlugin((nuxt) => {
  const DEFAULT = 'md'
  const cookieFontSize = useCookie<FontSize>(COOKIE_KEY_FONT_SIZE, { default: () => DEFAULT, maxAge: COOKIE_MAX_AGE })
  nuxt.vueApp.provide(InjectionKeyFontSize, cookieFontSize)

  if (!process.server) {
    watchEffect(() => {
      document.documentElement.style.setProperty('--font-size', fontSizeMap[cookieFontSize.value || DEFAULT])
    })
  }
  else {
    useHead({
      style: [
        {
          innerHTML: `:root { --font-size: ${fontSizeMap[cookieFontSize.value || DEFAULT]}; }`,
        },
      ],
    })
  }
})
