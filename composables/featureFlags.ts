import { STORAGE_KEY_FEATURE_FLAGS } from '~/constants'

export interface FeatureFlags {
  experimentalVirtualScroll: boolean
  experimentalAvatarOnAvatar: boolean
  experimentalGitHubCards: boolean
  experimentalUserSwitcherSidebar: boolean
}
export type FeatureFlagsMap = Record<string, FeatureFlags>

export function getDefaultFeatureFlags(): FeatureFlags {
  return {
    experimentalVirtualScroll: false,
    experimentalAvatarOnAvatar: true,
    experimentalGitHubCards: true,
    experimentalUserSwitcherSidebar: true,
  }
}

export const currentUserFeatureFlags = process.server
  ? computed(getDefaultFeatureFlags)
  : useUserLocalStorage(STORAGE_KEY_FEATURE_FLAGS, getDefaultFeatureFlags)

export function useFeatureFlags() {
  const featureFlags = currentUserFeatureFlags.value

  return featureFlags
}

export function toggleFeatureFlag(key: keyof FeatureFlags) {
  const featureFlags = currentUserFeatureFlags.value

  if (featureFlags[key])
    featureFlags[key] = !featureFlags[key]
  else
    featureFlags[key] = true
}

const userSwitcherSidebar = eagerComputed(() => useFeatureFlags().experimentalUserSwitcherSidebar)
export const showUserSwitcherSidebar = computed(() => useUsers().value.length > 1 && userSwitcherSidebar.value)
