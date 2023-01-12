import type { FeatureFlags } from './featureFlags'
import type { WellnessSettings } from './wellness'
import type { ColorMode, FontSize } from '~/types'
import { DEFAULT_FONT_SIZE, DEFAULT_LANGUAGE, STORAGE_KEY_SETTINGS } from '~/constants'

export interface UserSettings {
  featureFlags: Partial<FeatureFlags>
  wellnessSettings: Partial<WellnessSettings>
  colorMode?: ColorMode
  fontSize: FontSize
  language: string
  zenMode?: boolean
}

export function getDefaultUserSettings(): UserSettings {
  return {
    language: DEFAULT_LANGUAGE,
    fontSize: DEFAULT_FONT_SIZE,
    featureFlags: {},
    wellnessSettings: {},
  }
}

export const useUserSettings = () => {
  if (process.server)
    return useState('user-settings', () => getDefaultUserSettings())
  return useUserLocalStorage(STORAGE_KEY_SETTINGS, getDefaultUserSettings)
}
