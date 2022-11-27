export type Mutable<T> = {
  -readonly[P in keyof T]: T[P]
}

/**
 * Handle custom error using nuxt createError.
 */
export interface DataError {
  /**
   * Hide retry button?.
   *
   * @default false
   */
  noRetry?: boolean
}
