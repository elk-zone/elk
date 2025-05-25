import { type StatusVisibility } from "./status";

export type PreferenceReadingExpandMedia = "show_all" | "hide_all" | "default";

/**
 * Represents a user's preferences.
 * @see https://docs.joinmastodon.org/entities/preferences/
 */
export interface Preference {
  /** Default visibility for new posts. Equivalent to Source#privacy. */
  "posting:default:visibility": StatusVisibility;
  /** Default sensitivity flag for new posts. Equivalent to Source#sensitive. */
  "posting:default:sensitive": boolean;
  /** Default language for new posts. Equivalent to Source#language */
  "posting:default:language": string;
  /** Whether media attachments should be automatically displayed or blurred/hidden. */
  "reading:expand:media": PreferenceReadingExpandMedia;
  /** Whether CWs should be expanded by default. */
  "reading:expand:spoilers": boolean;
  /** Whether GIFs should be automatically played */
  "reading:autoplay:gifs": boolean;
}
