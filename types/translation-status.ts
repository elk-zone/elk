export interface ElkTranslationStatus {
  total: number
  locales: Record<string, {
    percentage: number
    total: number
  }>
}
