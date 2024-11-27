export type DomainBlockSeverity = "silence" | "suspend" | "noop";

export interface DomainBlock {
  /** The ID of the domain block in the database. */
  id: string;
  /** The domain of the domain block in the database. */
  domain: string;
  /** The create date of the domain block in the database. */
  createdAt: string;
  /** The date of the application that created this account. */
  severity: DomainBlockSeverity;
  /** The reject media of the domain. */
  rejectMedia: boolean;
  /** The reject report of the domain. */
  rejectReposts: boolean;
  /** The private comment of the domain. */
  privateComment?: string | null;
  /** The public comment of the domain. */
  publicComment?: string | null;
  /** The obfuscate of the domain block. */
  obfuscate: boolean;
  /** SHA256 of the domain. https://github.com/mastodon/mastodon/pull/29092 */
  digest: string;
}
