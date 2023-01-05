import { InjectionKeyCustomColors, InjectionKeyDropdownContext, InjectionKeyFontSize } from '~/constants/symbols'

export function useFontSizeRef() {
  return inject(InjectionKeyFontSize)!
}

export function useCustomColorsRef() {
  return inject(InjectionKeyCustomColors)!
}

export function useDropdownContext() {
  return inject(InjectionKeyDropdownContext, undefined)
}
