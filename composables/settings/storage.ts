import type { Ref } from 'vue'
import type { VueI18n } from 'vue-i18n'
import type { LocaleObject } from 'vue-i18n-routing'
import type { PreferencesSettings, UserSettings } from './definition'
import { STORAGE_KEY_SETTINGS } from '~/constants'

export function useUserSettings() {
  const i18n = useNuxtApp().vueApp.config.globalProperties.$i18n as VueI18n
  const { locales } = i18n
  const supportLanguages = (locales as LocaleObject[]).map(locale => locale.code)
  return useUserLocalStorage<UserSettings>(STORAGE_KEY_SETTINGS, () => getDefaultUserSettings(supportLanguages))
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
  return userSettings?.preferences?.[name] ?? DEFAULT__PREFERENCES_SETTINGS[name]
}

export function togglePreferences(key: keyof PreferencesSettings) {
  const flag = usePreferences(key)
  flag.value = !flag.value
}
