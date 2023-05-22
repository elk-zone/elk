export default defineNuxtPlugin(() => {
  const colorMode = useColorMode()
  useHead({
    meta: [{
      id: 'theme-color',
      name: 'theme-color',
      content: () => {
        switch (colorMode.value) {
          case 'light':
            return '#fafafa'
          case 'dim':
            return '#1a202c'
          case 'dark':
            return '#111111'
        }
      },
    }],
  })
})
