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
  /**
   * Change layout: if the page has `none` layout, it will be changed to `default`.
   * This option is added to support more layouts in the future
   *
   * @default 'default'
   */
  layout?: string
}
