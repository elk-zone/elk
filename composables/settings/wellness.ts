import type { Ref } from 'vue'
import type { UserSettings } from '.'

export interface WellnessSettings {
  hideBoostCount: boolean
  hideFavoriteCount: boolean
  hideFollowerCount: boolean
}
export type WellnessSettingsMap = Record<string, WellnessSettings>

const DEFAULT_WELLNESS_SETTINGS: WellnessSettings = {
  hideBoostCount: false,
  hideFavoriteCount: false,
  hideFollowerCount: false,
}

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
