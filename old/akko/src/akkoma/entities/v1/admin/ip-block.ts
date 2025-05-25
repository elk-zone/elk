export type IpBlockSeverity =
  | "sign_up_requires_approval"
  | "sign_up_block"
  | "no_access";

export interface IpBlock {
  /** The ID of the domain allow in the database. */
  id: string;
  /** The IP address and prefix to block. */
  ip: string;
  /** The policy to apply to this IP range. */
  severity: IpBlockSeverity;
  /** The reason for this IP block. */
  comment: string;
  /** The create date of the ip block. */
  createdAt: string;
  /** The number of seconds in which this IP block will expire. */
  expiresAt: number | null;
}
