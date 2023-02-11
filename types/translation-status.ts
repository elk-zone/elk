export interface ElkTranslationStatus {
  total: number
  locales: Record<string, {
    percentage: string
    total: number
  }>
}
