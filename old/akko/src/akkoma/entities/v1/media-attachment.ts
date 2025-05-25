export type MediaAttachmentType =
  | "image"
  | "video"
  | "gifv"
  | "audio"
  | "unknown";

export interface MediaAttachmentMetaImage {
  width: number;
  height: number;
  size: string;
  aspect: number;
}

export interface MediaAttachmentMetaVideo {
  width: number;
  height: number;
  frameRate: string;
  duration: number;
  bitrate: number;
  aspect: number;
}

export interface MediaAttachmentMetaFocus {
  x: number;
  y: number;
}

export interface MediaAttachmentMetaColors {
  background: string;
  foreground: string;
  accent: string;
}

export interface MediaAttachmentMeta {
  small?: MediaAttachmentMetaImage | MediaAttachmentMetaVideo | null;
  original?: MediaAttachmentMetaImage | MediaAttachmentMetaVideo | null;
  focus?: MediaAttachmentMetaFocus | null;
  colors?: MediaAttachmentMetaColors | null;
}

/**
 * Represents a file or media MediaAttachment that can be added to a status.
 * @see https://docs.joinmastodon.org/entities/MediaAttachment/
 */
export interface MediaAttachment {
  /** The ID of the MediaAttachment in the database. */
  id: string;
  /** The type of the MediaAttachment. */
  type: MediaAttachmentType;
  /** The location of the original full-size MediaAttachment. */
  url?: string | null;
  /** The location of a scaled-down preview of the MediaAttachment. */
  previewUrl: string;
  /** The location of the full-size original MediaAttachment on the remote website. */
  remoteUrl?: string | null;
  /** Remote version of previewUrl */
  previewRemoteUrl?: string | null;
  /** A shorter URL for the MediaAttachment. */
  textUrl?: string | null;
  /** Metadata returned by Paperclip. */
  meta?: MediaAttachmentMeta | null;
  /**
   * Alternate text that describes what is in the media MediaAttachment,
   * to be used for the visually impaired or when media MediaAttachments do not load.
   */
  description?: string | null;
  /**
   * A hash computed by the BlurHash algorithm,
   * for generating colorful preview thumbnails when media has not been downloaded yet.
   */
  blurhash?: string | null;
}
