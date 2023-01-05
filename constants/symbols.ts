import type { InjectionKey, Ref } from 'vue'
import type { CustomColors, FontSize } from '~/types'

export const InjectionKeyFontSize: InjectionKey<Ref<FontSize>> = Symbol('font-size')
export const InjectionKeyCustomColors: InjectionKey<Ref<CustomColors>> = Symbol('custom-colors')

export const InjectionKeyDropdownContext: InjectionKey<{
  hide: () => void
}> = Symbol('dropdown-context')
