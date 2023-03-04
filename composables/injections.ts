import { InjectionKeyDropdownContext } from '~/constants/symbols'

export function useDropdownContext() {
  return inject(InjectionKeyDropdownContext, undefined)
}
