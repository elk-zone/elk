import type { Account } from 'masto'
import { STORAGE_KEY_FEATURE_FLAGS } from '~/constants'

export interface FeatureFlags {
  experimentalVirtualScroll: boolean
  experimentalAvatarOnAvatar: boolean
}
export type FeatureFlagsMap = Record<string, FeatureFlags>

export const allFeatureFlags = useLocalStorage<FeatureFlagsMap>(STORAGE_KEY_FEATURE_FLAGS, {}, { deep: true })

export function getDefaultFeatureFlags(): FeatureFlags {
  return {
    experimentalVirtualScroll: false,
    experimentalAvatarOnAvatar: true,
  }
}

export const currentUserFeatureFlags = computed(() => {
  if (!currentUser.value?.account.id)
    return {} as FeatureFlags

  const id = `${currentUser.value.account.acct}@${currentUser.value.server}`

  if (!allFeatureFlags.value[id])
    allFeatureFlags.value[id] = getDefaultFeatureFlags()

  return allFeatureFlags.value[id] as FeatureFlags
})

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

export function clearUserFeatureFlags(account?: Account) {
  if (!account)
    account = currentUser.value?.account

  if (!account)
    return

  const id = `${account.acct}@${currentUser.value?.server}`
  if (!allFeatureFlags.value[id])
    return

  delete allFeatureFlags.value[id]
}

