import { InjectionKeyFontSize } from '~/constants/symbols'

export function useFontSizeRef() {
  return inject(InjectionKeyFontSize)!
}
