/**
 * Represents a domain that is blocked by the instance.
 */
export interface DomainBlock {
  /** The domain which is blocked. This may be obfuscated or partially censored. */
  domain: string;
  /** The SHA256 hash digest of the domain string. */
  digest: string;
  /** The level to which the domain is blocked. */
  severity: DomainBlockSeverity;
  /** An optional reason for the domain block. */
  comment?: string | null;
}

export type DomainBlockSeverity = "silence" | "suspend";
