declare module 'virtual:iso-639-1' {
  export interface AvailableLanguages {
    code: string
    nativeName: string
  }
  export const supportedTranslationLanguages: AvailableLanguages[]
  export function getDisplayName(code: string): string
}
