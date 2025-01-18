import type { Variant } from 'unocss'
import process from 'node:process'
import { variantParentMatcher } from '@unocss/preset-mini/utils'

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
      'border-dark': 'border-$c-border-dark',
      'border-strong': 'border-$c-text-base',
      'border-bg-base': 'border-$c-bg-base',
      'border-primary-light': 'border-$c-primary-light',

      // background
      'bg-base': 'bg-$c-bg-base',
      'bg-border': 'bg-$c-border',
      'bg-active': 'bg-$c-bg-active',
      'bg-secondary': 'bg-$c-text-secondary',
      'bg-secondary-light': 'bg-$c-text-secondary-light',
      'bg-primary-light': 'bg-$c-primary-light',
      'bg-primary-fade': 'bg-$c-primary-fade',
      'bg-card': 'bg-$c-bg-card',
      'bg-code': 'bg-$c-bg-code',
      'bg-dm': 'bg-$c-bg-dm',

      // text colors
      'text-base': 'text-$c-text-base',
      'text-code': 'text-$c-text-code',
      'text-inverted': 'text-$c-bg-base',
      'text-secondary': 'text-$c-text-secondary',
      'text-secondary-light': 'text-$c-text-secondary-light',

      // buttons
      'btn-base': 'cursor-pointer disabled:pointer-events-none disabled:bg-$c-bg-btn-disabled disabled:text-$c-text-btn-disabled',
      'btn-solid': 'btn-base px-4 py-2 rounded text-inverted bg-$c-primary hover:bg-$c-primary-active',
      'btn-outline': 'btn-base px-4 py-2 rounded text-$c-primary border border-$c-primary hover:bg-$c-primary hover:text-inverted',
      'btn-text': 'btn-base px-4 py-2 text-$c-primary hover:text-$c-primary-active',
      'btn-action-icon': 'btn-base hover:bg-active rounded-full h9 w9 flex items-center justify-center disabled:bg-transparent disabled:text-$c-text-secondary',
      'btn-danger': 'btn-base px-4 py-2 rounded text-white bg-$c-danger hover:bg-$c-danger-active',

      // input
      'input-base-focus': 'focus:outline-none focus:border-$c-primary',
      'input-base-disabled': 'disabled:pointer-events-none disabled:bg-gray-500/5 disabled:text-gray-500/50',
      'input-base': 'p2 rounded w-full bg-transparent border border-dark input-base-focus input-base-disabled',
      'input-error': 'border-$c-error focus:(outline-offset-0 outline-$c-error outline-1px)',

      'select-settings': 'p3 border border-base rounded w-full block bg-base',

      // link
      'text-link-rounded': 'focus:outline-none focus:ring-(2 primary inset) hover:bg-active rounded md:rounded-full px2 mx--2',

      // utils
      'flex-center': 'items-center justify-center',
      'flex-v-center': 'items-center',
      'flex-h-center': 'justify-center',
      'bg-hover-overflow': 'relative z-0 transition-colors duration-250 after-content-empty after:(absolute inset--4px bg-transparent rounded-full z--1 transition-colors duration-250) hover:after:(bg-active)',

      'timeline-title-style': 'text-primary text-lg font-bold',
    },
    [/^elk-group-hover[:-]([a-z0-9/-]+)$/, ([,r]) => `media-mouse-group-hover-${r} group-active-${r}`],
  ],
  presets: [
    presetUno({
      attributifyPseudo: true,
    }),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      extraProperties: {
        'color': 'inherit',
        // Avoid crushing of icons in crowded situations
        'min-width': '1.2em',
      },
    }),
    presetTypography(),
    presetWebFonts({
      provider: 'none',
      fonts: {
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
      danger: {
        DEFAULT: 'var(--c-danger)',
        active: 'var(--c-danger-active)',
      },
    },
  },
  variants: [
    ...(process.env.TAURI_PLATFORM
      ? <Variant<any>[]>[(matcher) => {
        if (!matcher.startsWith('native:'))
          return
        return {
          matcher: matcher.slice(7),
          layer: 'native',
        }
      }]
      : []),
    ...(process.env.TAURI_PLATFORM !== 'macos'
      ? <Variant<any>[]>[
        (matcher) => {
          if (!matcher.startsWith('native-mac:'))
            return
          return {
            matcher: matcher.slice(11),
            layer: 'native-mac',
          }
        },
      ]
      : []
    ),
    variantParentMatcher('fullscreen', '@media (display-mode: fullscreen)'),
    variantParentMatcher('coarse-pointer', '@media (pointer: coarse)'),
  ],
  rules: [
    // scrollbar-hide
    [/^scrollbar-hide$/, (_, { constructCSS }) => {
      let res = constructCSS({ 'scrollbar-width': 'none' })
      res += `\n${res.replace('{scrollbar-width:none;}', '::-webkit-scrollbar{display: none;}')}`
      return res
    }],
    [/^h-100dvh$/, (_, { constructCSS }) => {
      let res = constructCSS({ height: '100vh' })
      res += `\n${res.replace('{height:100vh;}', '{height:100vh;height:100dvh;}')}`
      return res
    }],
    ['box-shadow-outline', { 'box-shadow': '0 0 0 1px var(--c-primary)' }],
  ],
})
