/**
 * Represents an IP address associated with a user.
 * @see https://docs.joinmastodon.org/entities/Admin_Ip/
 */
export interface Ip {
  /** The IP address. */
  ip: string;
  /** The timestamp of when the IP address was last used for this account. */
  usedAt: string;
}
