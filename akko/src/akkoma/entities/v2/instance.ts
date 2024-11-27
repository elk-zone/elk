import { type Account, type Rule } from "../v1";

export interface InstanceUsageUsers {
  /** The number of active users in the past 4 weeks. */
  activeMonth: number;
}

export interface InstanceUsage {
  /** Usage data related to users on this instance. */
  users: InstanceUsageUsers;
}

export interface InstanceThumbnailVersions {
  /** The URL for the thumbnail image at 1x resolution. */
  "@1x": string;
  /** The URL for the thumbnail image at 2x resolution. */
  "@2x": string;
}

export interface InstanceThumbnail {
  /** The URL for the thumbnail image. */
  url: string;
  /** A hash computed by [the BlurHash algorithm](https://github.com/woltapp/blurhash), for generating colorful preview thumbnails when media has not been downloaded yet. */
  blurhash: string;
  /** Links to scaled resolution images, for high DPI screens. */
  versions: InstanceThumbnailVersions;
}

export interface InstanceUrls {
  /** The WebSockets URL for connecting to the streaming API. */
  streaming: string;
  /** Instance status URL */
  status?: string;
}

export interface InstanceAccountsConfiguration {
  /** The maximum number of featured tags allowed for each account. */
  maxFeaturedTags: number;
  /** The maximum number of pinned statuses for each account. */
  maxPinnedStatuses: number;
}

export interface InstanceStatusesConfiguration {
  /** The maximum number of allowed characters per status. */
  maxCharacters: number;
  /** The maximum number of media attachments that can be added to a status. */
  maxMediaAttachments: number;
  /** Each URL in a status will be assumed to be exactly this many characters. */
  charactersReservedPerUrl: number;
}

export interface InstanceMediaAttachmentsConfiguration {
  /** Contains MIME types that can be uploaded. */
  supportedMimeTypes: string[];
  /** The maximum size of any uploaded image, in bytes. */
  imageSizeLimit: number;
  /** The maximum number of pixels (width times height) for image uploads. */
  imageMatrixLimit: number;
  /** The maximum size of any uploaded video, in bytes. */
  videoSizeLimit: number;
  /** The maximum frame rate for any uploaded video. */
  videoFrameRateLimit: number;
  /** The maximum number of pixels (width times height) for video uploads. */
  videoMatrixLimit: number;
}

export interface InstancePollsConfiguration {
  /** Each poll is allowed to have up to this many options. */
  maxOptions: number;
  /** Each poll option is allowed to have this many characters. */
  maxCharactersPerOption: number;
  /** The shortest allowed poll duration, in seconds. */
  minExpiration: number;
  /** The longest allowed poll duration, in seconds. */
  maxExpiration: number;
}

export interface InstanceTranslationConfiguration {
  /** Whether the Translations API is available on this instance. */
  enabled: boolean;
}

export interface InstanceVapidConfiguration {
  /** The instances VAPID public key, used for push notifications, the same as */
  publicKey: string;
}

export interface InstanceConfiguration {
  /** URLs of interest for clients apps. */
  urls: InstanceUrls;
  /** Limits related to accounts. */
  accounts: InstanceAccountsConfiguration;
  /** Limits related to authoring statuses. */
  statuses: InstanceStatusesConfiguration;
  /** Hints for which attachments will be accepted. */
  mediaAttachments: InstanceMediaAttachmentsConfiguration;
  /** Limits related to polls. */
  polls: InstancePollsConfiguration;
  /** Hints related to translation. */
  translation: InstanceTranslationConfiguration;
  vapid: InstanceVapidConfiguration;
}

export interface InstanceRegistrations {
  /** Whether registrations are enabled. */
  enabled: boolean;
  /** Whether registrations require moderator approval. */
  approvalRequired: boolean;
  /** A custom message to be shown when registrations are closed. */
  message?: string | null;
}

export interface InstanceContact {
  /** An email address that can be messaged regarding inquiries or issues. */
  email: string;
  /** An account that can be contacted natively over the network regarding inquiries or issues. */
  account: Account;
}

export interface InstanceApiVersions {
  /** API version number that this server implements. Starting from Mastodon v4.3.0, API changes will come with a version number, which clients can check against this value. */
  mastodon: string;
}

export interface InstanceIcon {
  /** The URL of this icon. */
  src: string;
  /** The size of this icon. */
  size: string;
}

/**
 * Represents the software instance of Mastodon running on this domain.
 * @see https://docs.joinmastodon.org/entities/Instance/
 */
export interface Instance {
  /** The domain name of the instance. */
  domain: string;
  /** The title of the website. */
  title: string;
  /** The version of Mastodon installed on the instance. */
  version: string;
  /** The URL for the source code of the software running on this instance, in keeping with AGPL license requirements. */
  sourceUrl: string;
  /** A short, plain-text description defined by the admin. */
  description: string;
  /** Usage data for this instance. */
  usage: InstanceUsage;
  /** An image used to represent this instance */
  thumbnail: InstanceThumbnail;
  /** The list of available size variants for this instance configured icon. */
  icon: InstanceIcon[];
  /** Primary languages of the website and its staff. */
  languages: string[];
  /** Configured values and limits for this website. */
  configuration: InstanceConfiguration;
  /** Information about registering for this website. */
  registrations: InstanceRegistrations;
  /** Information about which version of the API is implemented by this server. It contains at least a mastodon attribute, and other implementations may have their own additional attributes. */
  apiVersions: InstanceApiVersions;
  /** Hints related to contacting a representative of the website. */
  contact: InstanceContact;
  /** An itemized list of rules for this website. */
  rules: Rule[];
}
