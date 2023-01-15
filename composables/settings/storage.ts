import type { Ref } from 'vue'
import type { VueI18n } from 'vue-i18n'
import type { LocaleObject } from 'vue-i18n-routing'
import type { FeatureFlags, UserSettings, WellnessSettings } from './definition'
import { STORAGE_KEY_SETTINGS } from '~/constants'

export function useUserSettings() {
  const i18n = useNuxtApp().vueApp.config.globalProperties.$i18n as VueI18n
  const { locales } = i18n
  const supportLanguages = (locales as LocaleObject[]).map(locale => locale.code)
  return useUserLocalStorage<UserSettings>(STORAGE_KEY_SETTINGS, () => getDefaultUserSettings(supportLanguages))
}

// TODO: refactor & simplify this

export function useWellnessSetting<T extends keyof WellnessSettings>(name: T): Ref<WellnessSettings[T]> {
  const userSettings = useUserSettings()
  return computed({
    get() {
      return getWellnessSetting(userSettings.value, name)
    },
    set(value) {
      userSettings.value.wellnessSettings[name] = value
    },
  })
}

export function getWellnessSetting<T extends keyof WellnessSettings>(userSettings: UserSettings, name: T): WellnessSettings[T] {
  return userSettings?.wellnessSettings?.[name] ?? DEFAULT_WELLNESS_SETTINGS[name]
}

export function toggleWellnessSetting(key: keyof WellnessSettings) {
  const flag = useWellnessSetting(key)
  flag.value = !flag.value
}

export function useFeatureFlag<T extends keyof FeatureFlags>(name: T): Ref<FeatureFlags[T]> {
  const userSettings = useUserSettings()
  return computed({
    get() {
      return getFeatureFlag(userSettings.value, name)
    },
    set(value) {
      userSettings.value.featureFlags[name] = value
    },
  })
}

export function getFeatureFlag<T extends keyof FeatureFlags>(userSettings: UserSettings, name: T): FeatureFlags[T] {
  return userSettings?.featureFlags?.[name] ?? DEFAULT_FEATURE_FLAGS[name]
}

export function toggleFeatureFlag(key: keyof FeatureFlags) {
  const flag = useFeatureFlag(key)
  flag.value = !flag.value
}
