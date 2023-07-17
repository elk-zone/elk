export function baseURLorEmpty(): string {
  return useRuntimeConfig().app.baseURL?.replace(/\/$/, '') || ''
}

export function makeAbsolutePath(path: string): string {
  return `${baseURLorEmpty()}${path}`
}

export function createRegExpForRootPath(path: string): any {
  return new RegExp(`${baseURLorEmpty()}${path}`.replace('/', '^/'))
}
