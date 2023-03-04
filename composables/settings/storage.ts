import type { Ref } from 'vue'
import type { VueI18n } from 'vue-i18n'
import type { LocaleObject } from 'vue-i18n-routing'
import type { FontSize, OldFontSize, PreferencesSettings, UserSettings } from './definition'
import { STORAGE_KEY_SETTINGS } from '~/constants'
import { oldFontSizeMap } from '~~/constants/options'

export function useUserSettings() {
  const i18n = useNuxtApp().vueApp.config.globalProperties.$i18n as VueI18n
  const { locales } = i18n
  const supportLanguages = (locales as LocaleObject[]).map(locale => locale.code)
  const settingsStorage = useUserLocalStorage<UserSettings>(STORAGE_KEY_SETTINGS, () => getDefaultUserSettings(supportLanguages))

  // Backward compatibility, font size was xs, sm, md, lg, xl before
  if (settingsStorage.value.fontSize && !settingsStorage.value.fontSize.includes('px'))
    settingsStorage.value.fontSize = oldFontSizeMap[settingsStorage.value.fontSize as OldFontSize] as FontSize

  return settingsStorage
}

// TODO: refactor & simplify this

export function usePreferences<T extends keyof PreferencesSettings>(name: T): Ref<PreferencesSettings[T]> {
  const userSettings = useUserSettings()
  return computed({
    get() {
      return getPreferences(userSettings.value, name)
    },
    set(value) {
      userSettings.value.preferences[name] = value
    },
  })
}

export function getPreferences<T extends keyof PreferencesSettings>(userSettings: UserSettings, name: T): PreferencesSettings[T] {
  const preference = userSettings?.preferences?.[name] ?? DEFAULT__PREFERENCES_SETTINGS[name]

  if (name === 'enableAutoplay')
    return getPreferences(userSettings, 'enableDataSaving') ? false : preference

  return preference
}

export function togglePreferences(key: keyof PreferencesSettings) {
  const flag = usePreferences(key)
  flag.value = !flag.value
}
