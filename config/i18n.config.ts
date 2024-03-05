import {
  currentLocales,
  datetimeFormats,
  numberFormats,
  pluralRules,
} from './i18n'

export default defineI18nConfig(() => {
  return {
    legacy: false,
    availableLocales: currentLocales.map(l => l.code),
    fallbackLocale: 'en-US',
    fallbackWarn: true,
    missingWarn: true,
    datetimeFormats,
    numberFormats,
    pluralRules,
  }
})
