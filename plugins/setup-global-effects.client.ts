import type { OldFontSize } from '~/composables/settings'
import { DEFAULT_FONT_SIZE } from '~/constants'
import { oldFontSizeMap } from '~/constants/options'

export default defineNuxtPlugin(() => {
  const userSettings = useUserSettings()
  const html = document.documentElement
  watchEffect(() => {
    const { fontSize } = userSettings.value
    html.style.setProperty('--font-size', fontSize ? (oldFontSizeMap[fontSize as OldFontSize] ?? fontSize) : DEFAULT_FONT_SIZE)
  })
  watchEffect(() => {
    html.classList.toggle('zen', getPreferences(userSettings.value, 'zenMode'))
  })
  watchEffect(() => {
    Object.entries(userSettings.value.themeColors || {}).forEach(([k, v]) => html.style.setProperty(k, v))
  })
})
