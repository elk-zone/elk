import type { FeatureFlags } from './featureFlags'
import type { WellnessSettings } from './wellness'
import type { ColorMode, FontSize } from '~/types'
import { STORAGE_KEY_SETTINGS } from '~/constants'

export interface UserSettings {
  featureFlags: Partial<FeatureFlags>
  wellnessSettings: Partial<WellnessSettings>
  colorMode?: ColorMode
  fontSize?: FontSize
  lang?: string
  zenMode?: boolean
}

export function getDefaultUserSettings(): UserSettings {
  return {
    featureFlags: {},
    wellnessSettings: {},
  }
}

export const userSettings = process.server
  ? computed(getDefaultUserSettings)
  : useUserLocalStorage(STORAGE_KEY_SETTINGS, getDefaultUserSettings)
