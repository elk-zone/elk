import type { InjectionKey, Ref } from 'vue'
import type { FontSize } from '~/types'

export const InjectionKeyFontSize = Symbol('font-size') as InjectionKey<Ref<FontSize>>
