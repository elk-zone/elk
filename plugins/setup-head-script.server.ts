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
  const handle = localStorage.getItem('${STORAGE_KEY_CURRENT_USER_HANDLE}')
  if (!handle) { return }
  const allSettings = JSON.parse(localStorage.getItem('${STORAGE_KEY_SETTINGS}') || '{}')
  const settings = allSettings[handle]
  if (!settings) { return }

  const html = document.querySelector('html')
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
})()`.trim().replace(/\s*\n+\s*/g, ';'),
      },
    ],
  })
})
