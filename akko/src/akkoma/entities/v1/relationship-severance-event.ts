/**
 * Summary of a moderation or block event that caused follow relationships to be severed.
 */
export interface RelationshipSeveranceEvent {
  /** The ID of the relationship severance event in the database. */
  id: string;
  /** Type of event. */
  type: RelationshipSeveranceEventType;
  /** Whether the list of severed relationships is unavailable because the underlying issue has been purged. */
  purged: boolean;
  /** Name of the target of the moderation/block event. This is either a domain name or a user handle, depending on the event type. */
  targetName: string;
  /** Number of follow relationships (in either direction) that were severed. */
  relationshipsCount?: number | null;
  /** When the event took place. */
  createdAt: string;
}

export type RelationshipSeveranceEventType =
  | "domain_block"
  | "user_domain_block"
  | "account_suspension";
