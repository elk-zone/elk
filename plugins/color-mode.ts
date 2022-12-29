export default defineNuxtPlugin(() => {
  const colorMode = useColorMode()
  useHead({
    meta: [{
      id: 'theme-color',
      name: 'theme-color',
      content: () => colorMode.value === 'dark' ? '#111111' : '#fafafa',
    }],
  })
})
