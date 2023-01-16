import { DEFAULT_FONT_SIZE } from '~/constants'

export type FontSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type ColorMode = 'light' | 'dark' | 'system'

export interface PreferencesSettings {
  hideBoostCount: boolean
  hideFavoriteCount: boolean
  hideFollowerCount: boolean
  grayscaleMode: boolean
  experimentalVirtualScroller: boolean
  experimentalGitHubCards: boolean
  experimentalUserPicker: boolean
}

export interface UserSettings {
  preferences: Partial<PreferencesSettings>
  colorMode?: ColorMode
  fontSize: FontSize
  language: string
  zenMode: boolean
  themeColors?: ThemeColors
}

export interface ThemeColors {
  '--theme-color-name': string

  '--c-primary': string
  '--c-primary-active': string
  '--c-primary-light': string
  '--c-primary-fade': string
  '--c-dark-primary': string
  '--c-dark-primary-active': string
  '--c-dark-primary-light': string
  '--c-dark-primary-fade': string

  '--rgb-primary': string
  '--rgb-dark-primary': string
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
    preferences: {},
  }
}

export const DEFAULT__PREFERENCES_SETTINGS: PreferencesSettings = {
  hideBoostCount: false,
  hideFavoriteCount: false,
  hideFollowerCount: false,
  grayscaleMode: false,
  experimentalVirtualScroller: true,
  experimentalGitHubCards: true,
  experimentalUserPicker: true,
}
