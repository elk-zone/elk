import { fontSizeMap } from '~/constants/options'
import { DEFAULT_FONT_SIZE } from '~/constants'

export default defineNuxtPlugin(() => {
  const userSettings = useUserSettings()
  const html = document.querySelector('html')!
  watchEffect(() => {
    html.style.setProperty('--font-size', fontSizeMap[userSettings.value.fontSize || DEFAULT_FONT_SIZE])
  })
  watchEffect(() => {
    html.classList.toggle('zen', userSettings.value.zenMode)
  })
})
