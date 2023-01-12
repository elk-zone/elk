import type { FontSize } from '~/composables/settings'
import { COOKIE_KEY_FONT_SIZE, COOKIE_MAX_AGE, DEFAULT_FONT_SIZE } from '~/constants'
import { fontSizeMap } from '~/constants/options'

export default defineNuxtPlugin(() => {
  const userSettings = useUserSettings()
  const cookieFontSize = useCookie<FontSize>(COOKIE_KEY_FONT_SIZE, { default: () => DEFAULT_FONT_SIZE, maxAge: COOKIE_MAX_AGE })
  if (!cookieFontSize.value || !fontSizeMap[cookieFontSize.value])
    cookieFontSize.value = DEFAULT_FONT_SIZE

  if (process.server) {
    userSettings.value.fontSize = cookieFontSize.value
    useHead({
      style: [
        { innerHTML: `:root { --font-size: ${fontSizeMap[cookieFontSize.value]}; }` },
      ],
    })
    return
  }

  userSettings.value.fontSize = cookieFontSize.value
  watch(() => userSettings.value.fontSize, (size) => {
    document.documentElement.style.setProperty('--font-size', fontSizeMap[size])
    cookieFontSize.value = size
  }, { immediate: true })
})
