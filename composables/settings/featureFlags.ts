import type { Ref } from 'vue'
import { userSettings } from '.'

export interface FeatureFlags {
  experimentalGitHubCards: boolean
  experimentalUserPicker: boolean
}
export type FeatureFlagsMap = Record<string, FeatureFlags>

const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  experimentalGitHubCards: true,
  experimentalUserPicker: true,
}

export function useFeatureFlag<T extends keyof FeatureFlags>(name: T): Ref<FeatureFlags[T]> {
  return computed({
    get() {
      return getFeatureFlag(name)
    },
    set(value) {
      if (userSettings.value)
        userSettings.value.featureFlags[name] = value
    },
  })
}

export function getFeatureFlag<T extends keyof FeatureFlags>(name: T): FeatureFlags[T] {
  return userSettings.value?.featureFlags?.[name] ?? DEFAULT_FEATURE_FLAGS[name]
}

export function toggleFeatureFlag(key: keyof FeatureFlags) {
  const flag = useFeatureFlag(key)
  flag.value = !flag.value
}
