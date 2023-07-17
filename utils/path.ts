export function makeAbsolutePath(path: string): string {
  return `${useRuntimeConfig().app.baseURL || ''}${path}`
}
