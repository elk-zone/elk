import type { InjectionKey } from 'vue'

export const InjectionKeyDropdownContext: InjectionKey<{
  hide: () => void
}> = Symbol('dropdown-context')
