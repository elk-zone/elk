import { DEFAULT_FONT_SIZE } from '~/constants'

export type FontSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type ColorMode = 'light' | 'dark' | 'system'

export interface FeatureFlags {
  experimentalVirtualScroller: boolean
  experimentalGitHubCards: boolean
  experimentalUserPicker: boolean
}

export interface WellnessSettings {
  hideBoostCount: boolean
  hideFavoriteCount: boolean
  hideFollowerCount: boolean
}

export interface UserSettings {
  featureFlags: Partial<FeatureFlags>
  wellnessSettings: Partial<WellnessSettings>
  colorMode?: ColorMode
  fontSize: FontSize
  language: string
  zenMode: boolean
}

export function getDefaultLanguage(languages: string[]) {
  if (process.server)
    return 'en-US'
  return matchLanguages(languages, navigator.languages) || 'en-US'
}

export function getDefaultUserSettings(locales: string[]): UserSettings {
  return {
    language: getDefaultLanguage(locales),
    fontSize: DEFAULT_FONT_SIZE,
    zenMode: false,
    featureFlags: {},
    wellnessSettings: {},
  }
}

export const DEFAULT_WELLNESS_SETTINGS: WellnessSettings = {
  hideBoostCount: false,
  hideFavoriteCount: false,
  hideFollowerCount: false,
}

export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  experimentalVirtualScroller: true,
  experimentalGitHubCards: true,
  experimentalUserPicker: true,
}
