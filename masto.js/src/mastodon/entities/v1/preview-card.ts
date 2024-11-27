import { type Account } from "./account";
import { type TagHistory } from "./tag";

export type PreviewCardType = "link" | "photo" | "video" | "rich";

/**
 * Represents an author in a rich preview card.
 * @see https://docs.joinmastodon.org/entities/PreviewCardAuthor/
 */
export interface PreviewCardAuthor {
  /** The original resource author’s name. Replaces the deprecated author_name attribute of the preview card. */
  name: string;
  /** A link to the author of the original resource. Replaces the deprecated author_url attribute of the preview card. */
  url: string;
  /** The fediverse account of the author. */
  account: Account | null;
}

/**
 * Represents a rich preview card that is generated using OpenGraph tags from a URL.
 * @see https://docs.joinmastodon.org/entities/PreviewCard
 */
export interface PreviewCard {
  /** Location of linked resource. */
  url: string;
  /** Title of linked resource. */
  title: string;
  /** Description of preview. */
  description: string;
  /** The type of the preview card. */
  type: PreviewCardType;
  /** Blurhash */
  blurhash: string;
  /** Fediverse account of the authors of the original resource. */
  authors: PreviewCardAuthor[];
  /**
   * The author of the original resource.
   * @deprecated Use `authors` instead
   */
  authorName?: string | null;
  /**
   * A link to the author of the original resource.
   * @deprecated Use `authors` instead
   */
  authorUrl?: string | null;
  /** The provider of the original resource. */
  providerName?: string | null;
  /** A link to the provider of the original resource. */
  providerUrl?: string | null;
  /** HTML to be used for generating the preview card. */
  html?: string | null;
  /** Width of preview, in pixels. */
  width?: number | null;
  /** Height of preview, in pixels. */
  height?: number | null;
  /** Preview thumbnail. */
  image?: string | null;
  /** Used for photo embeds, instead of custom `html`. */
  embedUrl: string;
  /** @see https://github.com/mastodon/mastodon/pull/27503 */
  language?: string;
}

export interface TrendLink extends PreviewCard {
  history: TagHistory[];
}
