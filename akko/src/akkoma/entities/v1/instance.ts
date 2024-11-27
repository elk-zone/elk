import { type Account } from "./account";
import { type Rule } from "./rule";

export interface InstanceStatusesConfiguration {
  maxCharacters: number;
  maxMediaAttachments: number;
  charactersReservedPerUrl: number;
}

export interface InstanceMediaAttachmentsConfiguration {
  supportedMimeTypes: string[];
  imageSizeLimit: number;
  imageMatrixLimit: number;
  videoSizeLimit: number;
  videoFrameRateLimit: number;
  videoMatrixLimit: number;
}

export interface InstancePollsConfiguration {
  maxOptions: number;
  maxCharactersPerOption: number;
  minExpiration: number;
  maxExpiration: number;
}

export interface InstanceAccountsConfiguration {
  maxFeaturedTags: number;
}

/**
 * @see https://github.com/mastodon/mastodon/pull/16485
 */
export interface InstanceConfiguration {
  statuses: InstanceStatusesConfiguration;
  mediaAttachments: InstanceMediaAttachmentsConfiguration;
  polls: InstancePollsConfiguration;
  accounts: InstanceAccountsConfiguration;
}

/**
 * Represents the software instance of Mastodon running on this domain.
 * @see https://docs.joinmastodon.org/entities/instance/
 */
export interface Instance {
  /** The domain name of the instance. */
  uri: string;
  /** The title of the website. */
  title: string;
  /** Admin-defined description of the Mastodon site. */
  description: string;
  /** A shorter description defined by the admin. */
  shortDescription: string;
  /** An email that may be contacted for any inquiries. */
  email: string;
  /** The version of Mastodon installed on the instance. */
  version: string;
  /** Primary languages of the website and its staff. */
  languages: string[];
  /** Whether registrations are enabled. */
  registrations: boolean;
  /** Whether registrations require moderator approval. */
  approvalRequired: boolean;
  /** URLs of interest for clients apps. */
  urls: InstanceURLs;
  /** Statistics about how much information the instance contains. */
  stats: InstanceStats;
  /** Whether invitation in enabled */
  invitesEnabled: boolean;
  /** List various values like file size limits and supported mime types */
  configuration: InstanceConfiguration;

  /** Banner image for the website. */
  thumbnail?: string | null;
  /** A user that can be contacted, as an alternative to `email`. */
  contactAccount?: Account | null;

  rules?: Rule[] | null;
}

export interface InstanceURLs {
  /** WebSockets address for push streaming. String (URL). */
  streamingApi: string;
}

export interface InstanceStats {
  /** Users registered on this instance. Number. */
  userCount: number;
  /** Statuses authored by users on instance. Number. */
  statusCount: number;
  /** Domains federated with this instance. Number. */
  domainCount: number;
}
