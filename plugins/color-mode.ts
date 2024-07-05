import { THEME_COLORS } from '~/constants'

export default defineNuxtPlugin(() => {
  const colorMode = useColorMode()
  useHead({
    meta: [
      {
        id: 'theme-color',
        name: 'theme-color',
        content: () => colorMode.value === 'dark' ? THEME_COLORS.themeDark : THEME_COLORS.themeLight,
      },
      {
        id: 'apple-mobile-web-app-status-bar-style',
        name: 'apple-mobile-web-app-status-bar-style',
        content: () => 'default',
      },
    ],
  })
})
