import type { InjectionKey, Ref } from 'vue'
import { STORAGE_KEY_FONT_SIZE } from '~/constants'

export type FontSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export const InjectionKeyFontSize = Symbol('fontSize') as InjectionKey<Ref<FontSize>>

export function setFontSize(size: FontSize) {
  inject(InjectionKeyFontSize)!.value = size
}

export function getFontSize() {
  return inject(InjectionKeyFontSize)!
}

export const fontSizeMap = {
  xs: '13px',
  sm: '14px',
  md: '15px',
  lg: '16px',
  xl: '17px',
}

export async function setupFontSize() {
  const fontSize = useCookie<FontSize>(STORAGE_KEY_FONT_SIZE, { default: () => 'md' })
  getCurrentInstance()?.appContext.app.provide(InjectionKeyFontSize, fontSize)

  if (!process.server) {
    watchEffect(() => {
      document.documentElement.style.setProperty('--font-size', fontSizeMap[fontSize.value || 'md'])
    })
  }
  else {
    useHead({
      style: [
        {
          innerHTML: `:root { --font-size: ${fontSizeMap[fontSize.value || 'md']}; }`,
        },
      ],
    })
  }
}
