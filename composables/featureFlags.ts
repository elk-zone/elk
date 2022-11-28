import type { Account } from 'masto'
import { STORAGE_KEY_FEATURE_FLAGS } from '~/constants'

export interface FeatureFlags {
  experimental: {
    virtualScroll: boolean
  }
}
export type FeatureFlagsMap = Record<string, FeatureFlags>

export const allFeatureFlags = useLocalStorage<FeatureFlagsMap>(STORAGE_KEY_FEATURE_FLAGS, {})

export function getDefaultFeatureFlags(): FeatureFlags {
  return {
    experimental: {
      virtualScroll: false,
    },
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
  return { featureFlags: currentUserFeatureFlags.value }
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

