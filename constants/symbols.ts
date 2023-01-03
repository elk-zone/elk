import type { InjectionKey, Ref } from 'vue'
import type { FontSize } from '~/types'

export const InjectionKeyFontSize: InjectionKey<Ref<FontSize>> = Symbol('font-size')

export const InjectionKeyDropdownContext: InjectionKey<{
  hide: () => void
}> = Symbol('dropdown-context')
