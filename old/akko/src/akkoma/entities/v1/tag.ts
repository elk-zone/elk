/**
 * Represents daily usage history of a hashtag.
 */
export interface TagHistory {
  /** UNIX timestamp on midnight of the given day. */
  day: string;
  /** the counted usage of the tag within that day. */
  uses: string;
  /** the total of accounts using the tag within that day. */
  accounts: string;
}

/**
 * Represents a hashtag used within the content of a status.
 * @see https://docs.joinmastodon.org/entities/tag/
 */
export interface Tag {
  /** The value of the hashtag after the # sign. */
  name: string;
  /** A link to the hashtag on the instance. */
  url: string;

  /** Usage statistics for given days. */
  history?: TagHistory[] | null;
  /** Whether the current token’s authorized user is following this tag. */
  following?: boolean | null;
}
