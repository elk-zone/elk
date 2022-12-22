const dark = useDark()

const samsungBrowser = isSamsungBrowser()

export const isDark = computed(() => dark.value && !samsungBrowser)
export const toggleDark = useToggle(isDark)

function isSamsungBrowser() {
  if (typeof window === 'undefined')
    return false

  return navigator.userAgent.match(/SamsungBrowser/i)
}
