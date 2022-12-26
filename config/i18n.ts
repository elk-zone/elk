import type { NuxtI18nOptions } from '@nuxtjs/i18n'
import type { DateTimeFormats } from '@intlify/core-base'
import type { LocaleObject } from '#i18n'

// @ts-expect-error dir is there, ts complaining
const locales: LocaleObject[] = [
  {
    code: 'en-US',
    file: 'en-US.json',
    name: 'English',
    dir: 'ltr',
  },
  {
    code: 'de-DE',
    file: 'de-DE.json',
    name: 'Deutsch',
    dir: 'ltr',
  },
  {
    code: 'zh-CN',
    file: 'zh-CN.json',
    name: '简体中文',
    dir: 'ltr',
  },
  {
    code: 'ja-JP',
    file: 'ja-JP.json',
    name: '日本語',
    dir: 'ltr',
  },
  {
    code: 'es-ES',
    file: 'es-ES.json',
    name: 'Español',
    dir: 'ltr',
  },
  {
    code: 'fr-FR',
    file: 'fr-FR.json',
    name: 'Français',
    dir: 'ltr',
  },
  {
    code: 'cs-CZ',
    file: 'cs-CZ.json',
    name: 'Česky',
    dir: 'ltr',
  },
  {
    code: 'ar',
    file: 'ar-EG.json',
    name: 'عربي',
    dir: 'rtl',
  },
].sort((a, b) => a.code.localeCompare(b.code))

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
