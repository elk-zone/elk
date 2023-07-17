export function makeAbsolutePath(path: string): string {
  const baseURL = useRuntimeConfig().app.baseURL?.replace(/\/$/, '') || ''
  return `${baseURL}${path}`
}
