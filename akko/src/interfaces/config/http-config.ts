export interface HttpConfig {
  resolvePath(path: string, params?: string | Record<string, unknown>): URL;
  mergeRequestInitWithDefaults(override?: RequestInit): RequestInit;
}
