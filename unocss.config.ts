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
      'text-base': 'text-$c-text-base',
      'btn-solid': 'px-4 py-2 rounded text-white bg-$c-primary hover:bg-$c-primary-active',
      'btn-outline': 'px-4 py-2 rounded text-$c-primary border-$c-primary hover:bg-$c-primary hover:text-white',
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
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  theme: {
    colors: {
      primary: 'var(--c-primary)',
    },
  },
})
