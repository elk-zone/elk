import type { FontSize } from '~/types'
import { COOKIE_KEY_FONT_SIZE, COOKIE_MAX_AGE, DEFAULT_FONT_SIZE } from '~/constants'
import { fontSizeMap } from '~/constants/options'

export default defineNuxtPlugin(() => {
  const userSettings = useUserSettings()
  const cookieFontSize = useCookie<FontSize>(COOKIE_KEY_FONT_SIZE, { default: () => DEFAULT_FONT_SIZE, maxAge: COOKIE_MAX_AGE })

  if (process.client) {
    watch(() => userSettings.value.fontSize, (size) => {
      document.documentElement.style.setProperty('--font-size', fontSizeMap[size])
      cookieFontSize.value = size
    }, { immediate: true })
  }
  else {
    const size = cookieFontSize.value || DEFAULT_FONT_SIZE
    useHead({
      style: [
        { innerHTML: `:root { --font-size: ${fontSizeMap[size]}; }` },
      ],
    })
    userSettings.value.fontSize = size
  }
})
