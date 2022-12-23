import { STORAGE_KEY_FONT_SIZE } from '~/constants'

export type FontSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export const fontSize = useLocalStorage<FontSize>(STORAGE_KEY_FONT_SIZE, 'md')

export function setFontSize(size: FontSize) {
  fontSize.value = size
}

export const fontSizeMap = {
  xs: '13px',
  sm: '14px',
  md: '15px',
  lg: '16px',
  xl: '17px',
}

export function setFontSizeCSSVar() {
  document.documentElement.style.setProperty('--font-size', fontSizeMap[fontSize.value])
}
