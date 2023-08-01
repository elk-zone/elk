import type { DateTimeFormats, NumberFormats, PluralizationRules } from '@intlify/core-base'
import { currentLocales } from './i18n'

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
}, {} as DateTimeFormats)

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
}, {} as NumberFormats)

const pluralRules = Object.values(currentLocales).reduce((acc, data) => {
  const pluralRule = data.pluralRule
  if (pluralRule) {
    acc[data.code] = pluralRule
    delete data.pluralRule
  }

  return acc
}, {} as PluralizationRules)

export default {
  availableLocales: currentLocales.map(l => l.code),
  fallbackLocale: 'en-US',
  fallbackWarn: false,
  missingWarn: false,
  datetimeFormats,
  numberFormats,
  pluralRules,
}
