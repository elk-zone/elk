import type { NuxtI18nOptions } from '@nuxtjs/i18n'
import type { DateTimeFormats } from '@intlify/core-base'
import type { LocaleObject } from '#i18n'

const locales: LocaleObject[] = [
  {
    code: 'en-US',
    file: 'en-US.json',
    name: 'English',
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

const i18n: NuxtI18nOptions = {
  locales,
  strategy: 'no_prefix',
  detectBrowserLanguage: false,
  langDir: 'locales',
  defaultLocale: 'en-US',
  vueI18n: {
    fallbackLocale: 'en-US',
    datetimeFormats,
  },
  lazy: true,
}

export { i18n }
