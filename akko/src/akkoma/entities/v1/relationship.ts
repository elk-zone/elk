/**
 * Represents the relationship between accounts, such as following / blocking / muting / etc.
 * @see https://docs.joinmastodon.org/entities/relationship/
 */
export interface Relationship {
  /** The account id. */
  id: string;
  /** Are you following this user? */
  following: boolean;
  /** Are you receiving this user's boosts in your home timeline? */
  showingReblogs: boolean;
  /** Have you enabled notifications for this user? */
  notifying: boolean;
  /** Which languages are you following from this user? */
  languages: string[];
  /** Are you followed by this user? */
  followedBy: boolean;
  /** Are you blocking this user? */
  blocking: boolean;
  /** Is this user blocking you? */
  blockedBy: boolean;
  /** Are you muting this user? */
  muting: boolean;
  /** Are you muting notifications from this user? */
  mutingNotifications: boolean;
  /** Do you have a pending follow request for this user? */
  requested: boolean;
  /** Are you blocking this user's domain? */
  domainBlocking: boolean;
  /** Are you featuring this user on your profile? */
  endorsed: boolean;
  /** Personal note for this account */
  note?: string | null;
  /** Whether the represented user has requested to follow you */
  requestedBy: boolean;
}
