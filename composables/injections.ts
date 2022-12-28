import { InjectionKeyColorMode, InjectionKeyFontSize } from '~/constants/symbols'

export function useFontSizeRef() {
  return inject(InjectionKeyFontSize)!
}

export function useColorModeRef() {
  return inject(InjectionKeyColorMode)!
}

export function toggleColorMode() {
  const colorMode = useColorModeRef()
  colorMode.value = colorMode.value === 'light' ? 'dark' : 'light'
}
