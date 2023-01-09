import type { Ref } from 'vue'
import { userSettings } from '.'

export interface WellnessSettings {
  hideBoostCount: boolean
  hideFavoriteCount: boolean
  hideFollowerCount: boolean
}
export type WellnessSettingsMap = Record<string, WellnessSettings>

const DEFAULT_WELLNESS_SETTINGS: WellnessSettings = {
  hideBoostCount: true,
  hideFavoriteCount: true,
  hideFollowerCount: true,
}

export function useWellnessSetting<T extends keyof WellnessSettings>(name: T): Ref<WellnessSettings[T]> {
  return computed({
    get() {
      return getWellnessSetting(name)
    },
    set(value) {
      if (userSettings.value)
        userSettings.value.wellnessSettings[name] = value
    },
  })
}

export function getWellnessSetting<T extends keyof WellnessSettings>(name: T): WellnessSettings[T] {
  return userSettings.value?.wellnessSettings?.[name] ?? DEFAULT_WELLNESS_SETTINGS[name]
}

export function toggleWellnessSetting(key: keyof WellnessSettings) {
  const flag = useWellnessSetting(key)
  flag.value = !flag.value
}
