/**
 * Represents a custom emoji.
 * @see https://docs.joinmastodon.org/entities/CustomEmoji/
 */
export interface CustomEmoji {
  /** The name of the custom emoji. */
  shortcode: string;
  /** A link to the custom emoji. */
  url: string;
  /** A link to a static copy of the custom emoji. */
  staticUrl: string;
  /** Whether this Emoji should be visible in the picker or unlisted. */
  visibleInPicker: boolean;

  /** Used for sorting custom emoji in the picker. */
  category?: string | null;
}
