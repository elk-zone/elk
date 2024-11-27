/**
 * Represents a status ID that, if matched, should cause the filter action to be taken.
 * @see https://docs.joinmastodon.org/entities/FilterStatus/
 */
export interface FilterStatus {
  /** The ID of the FilterStatus in the database. */
  id: string;
  /** The ID of the filtered Status in the database. */
  statusId: string;
}
