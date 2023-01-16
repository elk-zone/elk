import { STORAGE_KEY_CURRENT_USER_HANDLE, STORAGE_KEY_SETTINGS } from '~/constants'
import { fontSizeMap } from '~/constants/options'

/**
 * Injecting scripts before renders
 */
export default defineNuxtPlugin(() => {
  useHead({
    script: [
      {
        innerHTML: `
;(function() {
  const handle = localStorage.getItem('${STORAGE_KEY_CURRENT_USER_HANDLE}') || '[anonymous]'
  const allSettings = JSON.parse(localStorage.getItem('${STORAGE_KEY_SETTINGS}') || '{}')
  const settings = allSettings[handle]
  if (!settings) { return }

  const html = document.documentElement
  ${process.dev ? 'console.log({ settings })' : ''}

  if (settings.fontSize) {
    const fontSizeMap = ${JSON.stringify(fontSizeMap)}
    html.style.setProperty('--font-size', fontSizeMap[settings.fontSize])
  }
  if (settings.language) {
    html.setAttribute('lang', settings.language)
  }
  if (settings.zenMode) {
    html.classList.add('zen')
  }
  if (settings.themeColors) {
    Object.entries(settings.themeColors).map(i => html.style.setProperty(i[0], i[1]))
  }
})()`.trim().replace(/\s*\n+\s*/g, ';'),
      },
    ],
  })
})
