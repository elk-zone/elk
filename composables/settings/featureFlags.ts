import type { Ref } from 'vue'
import type { UserSettings } from '.'

export interface FeatureFlags {
  experimentalVirtualScroller: boolean
  experimentalGitHubCards: boolean
  experimentalUserPicker: boolean
}
export type FeatureFlagsMap = Record<string, FeatureFlags>

const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  experimentalVirtualScroller: true,
  experimentalGitHubCards: true,
  experimentalUserPicker: true,
}

export function useFeatureFlag<T extends keyof FeatureFlags>(name: T): Ref<FeatureFlags[T]> {
  const userSettings = useUserSettings()
  return computed({
    get() {
      return getFeatureFlag(userSettings.value, name)
    },
    set(value) {
      if (userSettings.value)
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
