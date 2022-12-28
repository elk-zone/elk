import type { ColorMode } from '~/types'
import { InjectionKeyColorMode } from '~/constants/symbols'
import { COOKIE_KEY_COLOR_MODE } from '~/constants'

export default defineNuxtPlugin((nuxt) => {
  const cookieColorMode = useCookie<ColorMode | null>(COOKIE_KEY_COLOR_MODE, { default: () => null })

  const preferColorMode = process.server ? computed(() => 'light') : usePreferredColorScheme()
  const colorMode = computed<ColorMode>({
    get() {
      return cookieColorMode.value || preferColorMode.value as ColorMode
    },
    set(value) {
      cookieColorMode.value = value
    },
  })

  nuxt.vueApp.provide(InjectionKeyColorMode, colorMode)

  if (process.server) {
    useHead({
      htmlAttrs: {
        class: colorMode,
      },
    })
  }
  else {
    watchEffect(() => {
      document.documentElement.classList.toggle('dark', colorMode.value === 'dark')
      document.documentElement.classList.toggle('light', colorMode.value === 'light')
    })
  }

  useHead({
    meta: [{
      id: 'theme-color',
      name: 'theme-color',
      content: computed(() => colorMode.value === 'dark' ? '#111111' : '#ffffff'),
    }],
  })
})
