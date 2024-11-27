/**
 * Represents a keyword that, if matched, should cause the filter action to be taken.
 * @see https://docs.joinmastodon.org/entities/FilterKeyword/
 */
export interface FilterKeyword {
  /** The ID of the FilterKeyword in the database. */
  id: string;
  /** The phrase to be matched against. */
  keyword: string;
  /** Should the filter consider word boundaries? See [implementation guidelines](https://docs.joinmastodon.org/api/guidelines/#filters) for filters. */
  wholeWord: boolean;
}
