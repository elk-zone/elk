import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  shortcuts: [
    {
      'border-base': 'border-$c-border',
      'bg-base': 'bg-$c-bg-base',
      'bg-active': 'bg-$c-bg-active',
      'text-base': 'text-$c-text-base',
      'text-secondary': 'text-$c-text-secondary',
      'interact-disabled': 'disabled:opacity-50 disabled:pointer-events-none disabled:saturate-0',
      'btn-solid': 'px-4 py-2 rounded text-white bg-$c-primary hover:bg-$c-primary-active interact-disabled',
      'btn-outline': 'px-4 py-2 rounded text-$c-primary border border-$c-primary hover:bg-$c-primary hover:text-white interact-disabled',
      'btn-text': 'px-4 py-2 text-$c-primary hover:text-$c-primary-active interact-disabled',
    },
  ],
  presets: [
    presetUno({
      attributifyPseudo: true,
    }),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
    }),
    presetTypography(),
    presetWebFonts({
      fonts: {
        sans: 'DM Sans',
        serif: 'DM Serif Display',
        mono: 'DM Mono',
        script: 'Homemade Apple',
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  theme: {
    colors: {
      primary: {
        DEFAULT: 'var(--c-primary)',
        active: 'var(--c-primary-active)',
      },
    },
  },
})
