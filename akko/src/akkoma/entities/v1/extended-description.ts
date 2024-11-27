/**
 * Represents an extended description for the instance, to be shown on its about page.
 */
export interface ExtendedDescription {
  /** The rendered HTML content of the extended description. */
  content: string;
  /** A timestamp of when the extended description was last updated. */
  updatedAt?: string | null;
}
