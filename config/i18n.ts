import type { NuxtI18nOptions } from '@nuxtjs/i18n'
import type { DateTimeFormats } from '@intlify/core-base'
import type { LocaleObject } from '#i18n'

const locales = ([
  {
    code: 'en-US',
    file: 'en-US.json',
    name: 'English (US)',
  },
  {
    code: 'en-GB',
    file: 'en-GB.json',
    name: 'English (UK)',
  },
  {
    code: 'de-DE',
    file: 'de-DE.json',
    name: 'Deutsch',
  },
  {
    code: 'zh-CN',
    file: 'zh-CN.json',
    name: '简体中文',
  },
  {
    code: 'ja-JP',
    file: 'ja-JP.json',
    name: '日本語',
  },
  {
    code: 'es-ES',
    file: 'es-ES.json',
    name: 'Español',
  },
  {
    code: 'fr-FR',
    file: 'fr-FR.json',
    name: 'Français',
  },
  {
    code: 'cs-CZ',
    file: 'cs-CZ.json',
    name: 'Česky',
  },
  {
    code: 'ar',
    file: 'ar-EG.json',
    name: 'العربية',
    dir: 'rtl',
  },
] satisfies LocaleObject[]).sort((a, b) => a.code.localeCompare(b.code))

const datetimeFormats = Object.keys(locales).reduce((acc, key) => {
  acc[key] = {
    short: {
      dateStyle: 'short',
      timeStyle: 'short',
    },
    long: {
      dateStyle: 'long',
      timeStyle: 'medium',
    },
  }
  return acc
}, <DateTimeFormats>{})

export const i18n: NuxtI18nOptions = {
  locales,
  strategy: 'no_prefix',
  detectBrowserLanguage: false,
  langDir: 'locales',
  defaultLocale: 'en-US',
  vueI18n: {
    fallbackLocale: 'en-US',
    fallbackWarn: false,
    missingWarn: false,
    datetimeFormats,
  },
  lazy: true,
}
