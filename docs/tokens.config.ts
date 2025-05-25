import { defineTheme } from 'pinceau'
import { getColors } from 'theme-colors'

const light = getColors('#995e1b')
const primary = Object
  .entries(getColors('#d98018'))
  .reduce((acc, [key, value]) => {
    acc[key] = {
      initial: light[key]!,
      dark: value,
    }
    return acc
  }, {} as Record<string | number, { initial: string, dark: string }>)

export default defineTheme({
  color: { primary },
})
