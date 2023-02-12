export interface LocaleEntry {
  title: string
  file: string
  translated: string[]
  missing: string[]
  outdated: string[]
  total: number
  isSource?: boolean
}

export type TranslationStatus = Record<string, LocaleEntry>
