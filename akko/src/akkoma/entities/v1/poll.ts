import { type CustomEmoji } from "./custom-emoji";

export interface PollOption {
  /** The text value of the poll option. String. */
  title: string;
  /** The number of received votes for this option. Number, or null if results are not published yet. */
  votesCount?: number;
  /** Custom emoji to be used for rendering poll options. */
  emojis: CustomEmoji[];
}

/**
 * Represents a poll attached to a status.
 * @see https://docs.joinmastodon.org/entities/poll/
 */
export interface Poll {
  /** The ID of the poll in the database. */
  id: string;
  /** When the poll ends. */
  expiresAt?: string | null;
  /** Is the poll currently expired? */
  expired: boolean;
  /** Does the poll allow multiple-choice answers? */
  multiple: boolean;
  /** How many votes have been received. */
  votesCount: number;
  /** How many unique accounts have voted on a multiple-choice poll. */
  votersCount?: number | null;
  /** When called with a user token, has the authorized user voted? */
  voted?: boolean;
  /**
   * When called with a user token, which options has the authorized user chosen?
   * Contains an array of index values for options.
   */
  ownVotes?: number[] | null;
  /** Possible answers for the poll. */
  options: PollOption[];
}
