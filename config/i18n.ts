import type { NuxtI18nOptions } from '@nuxtjs/i18n'
import type { DateTimeFormats, NumberFormats, PluralizationRule, PluralizationRules } from '@intlify/core-base'

import type { LocaleObject } from '#i18n'

interface LocaleObjectData extends LocaleObject {
  numberFormats?: NumberFormats
  dateTimeFormats?: DateTimeFormats
  pluralRule?: PluralizationRule
}

export const countryLocaleVariants: Record<string, (LocaleObjectData & { country?: boolean }) []> = {
  ar: [
    // ar.json contains ar-EG translations
    // { code: 'ar-DZ', name: 'Arabic (Algeria)' },
    // { code: 'ar-BH', name: 'Arabic (Bahrain)' },
    { country: true, code: 'ar-EG', name: 'العربية' },
    // { code: 'ar-EG', name: 'Arabic (Egypt)' },
    // { code: 'ar-IQ', name: 'Arabic (Iraq)' },
    // { code: 'ar-JO', name: 'Arabic (Jordan)' },
    // { code: 'ar-KW', name: 'Arabic (Kuwait)' },
    // { code: 'ar-LB', name: 'Arabic (Lebanon)' },
    // { code: 'ar-LY', name: 'Arabic (Libya)' },
    // { code: 'ar-MA', name: 'Arabic (Morocco)' },
    // { code: 'ar-OM', name: 'Arabic (Oman)' },
    // { code: 'ar-QA', name: 'Arabic (Qatar)' },
    // { code: 'ar-SA', name: 'Arabic (Saudi Arabia)' },
    // { code: 'ar-SY', name: 'Arabic (Syria)' },
    // { code: 'ar-TN', name: 'Arabic (Tunisia)' },
    // { code: 'ar-AE', name: 'Arabic (U.A.E.)' },
    // { code: 'ar-YE', name: 'Arabic (Yemen)' },
  ],
  en: [
    // en.json contains en-US translations
    { country: true, code: 'en-US', name: 'English (US)' },
    { code: 'en-GB', name: 'English (UK)' },
  ],
  ca: [
    // ca.json contains ca-ES translations
    // { code: 'ca-AD', name: 'Català (Andorra)' },
    { country: true, code: 'ca-ES', name: 'Català (Espanya)' },
    { code: 'ca-valencia', name: 'Català (valencià)' },
    // { code: 'ca-FR', name: 'Català (França)' },
    // { code: 'ca-IT', name: 'Català (Itàlia)' },
  ],
  es: [
    // es.json contains es-ES translations
    // { code: 'es-AR', name: 'Español (Argentina)' },
    // { code: 'es-BO', name: 'Español (Bolivia)' },
    // { code: 'es-CL', name: 'Español (Chile)' },
    // { code: 'es-CO', name: 'Español (Colombia)' },
    // { code: 'es-CR', name: 'Español (Costa Rica)' },
    // { code: 'es-DO', name: 'Español (República Dominicana)' },
    // { code: 'es-EC', name: 'Español (Ecuador)' },
    { country: true, code: 'es-ES', name: 'Español (España)' },
    // TODO: Support es-419, if we include spanish country variants remove also fix on utils/language.ts module
    { code: 'es-419', name: 'Español (Latinoamérica)' },
    // { code: 'es-GT', name: 'Español (Guatemala)' },
    // { code: 'es-HN', name: 'Español (Honduras)' },
    // { code: 'es-MX', name: 'Español (México)' },
    // { code: 'es-NI', name: 'Español (Nicaragua)' },
    // { code: 'es-PA', name: 'Español (Panamá)' },
    // { code: 'es-PE', name: 'Español (Perú)' },
    // { code: 'es-PR', name: 'Español (Puerto Rico)' },
    // { code: 'es-SV', name: 'Español (El Salvador)' },
    // { code: 'es-US', name: 'Español (Estados Unidos)' },
    // { code: 'es-UY', name: 'Español (Uruguay)' },
    // { code: 'es-VE', name: 'Español (Venezuela)' },
  ],
  pt: [
    // pt.json contains pt-PT translations
    { country: true, code: 'pt-PT', name: 'Português (Portugal)' },
    { code: 'pt-BR', name: 'Português (Brasil)' },
  ],
}

const locales: LocaleObjectData[] = [
  {
    code: 'en',
    file: 'en.json',
    name: 'English',
  },
  ({
    code: 'ar',
    file: 'ar.json',
    name: 'العربية',
    dir: 'rtl',
    pluralRule: (choice: number) => {
      const name = new Intl.PluralRules('ar-EG').select(choice)
      return { zero: 0, one: 1, two: 2, few: 3, many: 4, other: 5 }[name]
    },
  } satisfies LocaleObjectData),
  {
    code: 'ca',
    file: 'ca.json',
    name: 'Català',
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
    code: 'zh-TW',
    file: 'zh-TW.json',
    name: '繁體中文',
  },
  {
    code: 'ja-JP',
    file: 'ja-JP.json',
    name: '日本語',
  },
  {
    code: 'nl-NL',
    file: 'nl-NL.json',
    name: 'Nederlands',
  },
  {
    code: 'es',
    file: 'es.json',
    name: 'Español',
  },
  {
    code: 'eu-ES',
    file: 'eu-ES.json',
    name: 'Euskara',
  },
  {
    code: 'fr-FR',
    file: 'fr-FR.json',
    name: 'Français',
  },
  {
    code: 'ru-RU',
    file: 'ru-RU.json',
    name: 'Русский',
    pluralRule: (choice: number) => {
      const name = new Intl.PluralRules('ru-RU').select(choice)
      return { zero: 2 /* not used */, one: 0, two: 1 /* not used */, few: 1, many: 2, other: 3 }[name]
    },
  },
  {
    code: 'uk-UA',
    file: 'uk-UA.json',
    name: 'Українська',
    pluralRule: (choice: number) => {
      if (choice === 0)
        return 0

      const name = new Intl.PluralRules('uk-UA').select(choice)
      return { zero: 0, one: 1, two: 0 /* not used */, few: 2, many: 3, other: 4 }[name]
    },
  },
  {
    code: 'cs-CZ',
    file: 'cs-CZ.json',
    name: 'Česky',
  },
  {
    code: 'pl-PL',
    file: 'pl-PL.json',
    name: 'Polski',
    pluralRule: (choice: number) => {
      if (choice === 0)
        return 0

      const name = new Intl.PluralRules('pl-PL').select(choice)
      return { zero: 0, one: 1, two: 0 /* not used */, few: 2, many: 3, other: 4 }[name]
    },
  },
  {
    code: 'pt',
    file: 'pt.json',
    name: 'Português',
  },
  {
    code: 'tr-TR',
    file: 'tr-TR.json',
    name: 'Türkçe',
  },
  {
    code: 'id-ID',
    file: 'id-ID.json',
    name: 'Indonesia',
  },
  {
    code: 'fi-FI',
    file: 'fi-FI.json',
    name: 'suomeksi',
  },
  {
    code: 'gl-ES',
    file: 'gl-ES.json',
    name: 'Galego',
  },
  {
    code: 'ko-KR',
    file: 'ko-KR.json',
    name: '한국어',
  },
  {
    code: 'it-IT',
    file: 'it-IT.json',
    name: 'Italiano',
  },
  {
    code: 'th-TH',
    file: 'th-TH.json',
    name: 'ไทย',
  },
  {
    code: 'tl-PH',
    file: 'tl-PH.json',
    name: 'Tagalog',
  },
  {
    code: 'vi-VN',
    file: 'vi-VN.json',
    name: 'Tiếng Việt',
  },
]

function buildLocales() {
  const useLocales = Object.values(locales).reduce((acc, data) => {
    const locales = countryLocaleVariants[data.code]
    if (locales) {
      locales.forEach((l) => {
        const entry: LocaleObjectData = {
          ...data,
          code: l.code,
          name: l.name,
          files: [data.file!, `${l.code}.json`],
        }
        delete entry.file
        acc.push(entry)
      })
    }
    else {
      acc.push(data)
    }
    return acc
  }, <LocaleObjectData[]>[])

  return useLocales.sort((a, b) => a.code.localeCompare(b.code))
}

export const currentLocales = buildLocales()

const datetimeFormats = Object.values(currentLocales).reduce((acc, data) => {
  const dateTimeFormats = data.dateTimeFormats
  if (dateTimeFormats) {
    acc[data.code] = { ...dateTimeFormats }
    delete data.dateTimeFormats
  }
  else {
    acc[data.code] = {
      shortDate: {
        dateStyle: 'short',
      },
      short: {
        dateStyle: 'short',
        timeStyle: 'short',
      },
      long: {
        dateStyle: 'long',
        timeStyle: 'medium',
      },
    }
  }

  return acc
}, <DateTimeFormats>{})

const numberFormats = Object.values(currentLocales).reduce((acc, data) => {
  const numberFormats = data.numberFormats
  if (numberFormats) {
    acc[data.code] = { ...numberFormats }
    delete data.numberFormats
  }
  else {
    acc[data.code] = {
      percentage: {
        style: 'percent',
        maximumFractionDigits: 1,
      },
      smallCounting: {
        style: 'decimal',
        maximumFractionDigits: 0,
      },
      kiloCounting: {
        notation: 'compact',
        compactDisplay: 'short',
        maximumFractionDigits: 1,
      },
      millionCounting: {
        notation: 'compact',
        compactDisplay: 'short',
        maximumFractionDigits: 2,
      },
    }
  }

  return acc
}, <NumberFormats>{})

const pluralRules = Object.values(currentLocales).reduce((acc, data) => {
  const pluralRule = data.pluralRule
  if (pluralRule) {
    acc[data.code] = pluralRule
    delete data.pluralRule
  }

  return acc
}, <PluralizationRules>{})

export const i18n: NuxtI18nOptions = {
  locales: currentLocales,
  lazy: true,
  strategy: 'no_prefix',
  detectBrowserLanguage: false,
  langDir: 'locales',
  defaultLocale: 'en-US',
  vueI18n: {
    availableLocales: currentLocales.map(l => l.code),
    fallbackLocale: 'en-US',
    fallbackWarn: false,
    missingWarn: false,
    datetimeFormats,
    numberFormats,
    pluralRules,
  },
}
