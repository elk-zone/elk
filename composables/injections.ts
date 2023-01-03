import { InjectionKeyDropdownContext, InjectionKeyFontSize } from '~/constants/symbols'

export function useFontSizeRef() {
  return inject(InjectionKeyFontSize)!
}

export function useDropdownContext() {
  return inject(InjectionKeyDropdownContext, undefined)
}
