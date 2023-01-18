import { fontSizeMap } from '~/constants/options'
import { DEFAULT_FONT_SIZE } from '~/constants'

export default defineNuxtPlugin(() => {
  const userSettings = useUserSettings()
  const html = document.documentElement
  watchEffect(() => {
    html.style.setProperty('--font-size', fontSizeMap[userSettings.value.fontSize || DEFAULT_FONT_SIZE])
  })
  watchEffect(() => {
    html.classList.toggle('zen', userSettings.value.zenMode)
  })
  watchEffect(() => {
    Object.entries(userSettings.value.themeColors || {}).forEach(([k, v]) => html.style.setProperty(k, v))
  })
})
