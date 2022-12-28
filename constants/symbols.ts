import type { InjectionKey, Ref } from 'vue'
import type { ColorMode, FontSize } from '~/types'

export const InjectionKeyFontSize = Symbol('font-size') as InjectionKey<Ref<FontSize>>
export const InjectionKeyColorMode = Symbol('color-mode') as InjectionKey<Ref<ColorMode>>
