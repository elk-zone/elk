/**
 * Represents a hashtag that is featured on a profile.
 * @see https://docs.joinmastodon.org/entities/featuredtag/
 */
export interface FeaturedTag {
  /** The internal ID of the featured tag in the database. */
  id: string;
  /** The name of the hashtag being featured. */
  name: string;
  /** The number of authored statuses containing this hashtag */
  statusesCount: number;
  /** The timestamp of the last authored status containing this hashtag. */
  lastStatusAt?: string | null;
}
