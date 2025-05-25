import type { ThemeColors } from '~/composables/settings'
import chroma from 'chroma-js'

// #cc7d24 -> hcl(67.14,62.19,59.56)
export const themesColor = Array.from(
  { length: 9 },
  (_, i) => chroma.hcl((67.14 + i * 40) % 360, 62.19, 59.56).hex(),
)

export function getThemeColors(primary: string): ThemeColors {
  const c = chroma(primary)
  const dc = c.brighten(0.1)

  return {
    '--theme-color-name': primary,

    '--c-primary': 'rgb(var(--rgb-primary))',
    '--c-primary-active': c.darken(0.5).hex(),
    '--c-primary-light': c.alpha(0.5).hex(),
    '--c-primary-fade': c.darken(0.1).alpha(0.1).hex(),
    '--rgb-primary': c.rgb().join(', '),

    '--c-dark-primary': 'rgb(var(--rgb-dark-primary))',
    '--c-dark-primary-active': dc.darken(0.5).hex(),
    '--c-dark-primary-light': dc.alpha(0.5).hex(),
    '--c-dark-primary-fade': dc.darken(0.1).alpha(0.1).hex(),
    '--rgb-dark-primary': c.rgb().join(', '),
  }
}

export const colorsMap = themesColor.map(color => [color, getThemeColors(color)])
