import { type CustomEmoji } from "./custom-emoji";
import { type Role } from "./role";
import { type StatusVisibility } from "./status";

/**
 * Represents display or publishing preferences of user's own account.
 * Returned as an additional entity when verifying and updated credentials, as an attribute of Account.
 * @see https://docs.joinmastodon.org/entities/source/
 */
export interface AccountSource {
  /** Profile bio. */
  note: string;
  /** Metadata about the account. */
  fields: AccountField[];

  /** The default post privacy to be used for new statuses. */
  privacy?: StatusVisibility | null;
  /** Whether new statuses should be marked sensitive by default. */
  sensitive?: boolean | null;
  /** The default posting language for new statuses. */
  language: string | null;
  /** The number of pending follow requests. */
  followRequestsCount?: number | null;
}

/**
 * Represents a profile field as a name-value pair with optional verification.
 */
export interface AccountField {
  /** The key of a given field's key-value pair. */
  name: string;
  /** The value associated with the `name` key. */
  value: string;

  /** Timestamp of when the server verified a URL value for a rel="me” link. */
  verifiedAt?: string | null;
}

/**
 * Represents a user of Mastodon and their associated profile.
 * @see https://docs.joinmastodon.org/entities/account/
 */
export interface Account {
  /** The account id */
  id: string;
  /** The username of the account, not including domain */
  username: string;
  /** The WebFinger account URI. Equal to `username` for local users, or `username@domain` for remote users. */
  acct: string;
  /** The location of the user's profile page. */
  url: string;
  /** The profile's display name. */
  displayName: string;
  /** The profile's bio / description. */
  note: string;
  /** An image icon that is shown next to statuses and in the profile. */
  avatar: string;
  /** A static version of the `avatar`. Equal to avatar if its value is a static image; different if `avatar` is an animated GIF. */
  avatarStatic: string;
  /** An image banner that is shown above the profile and in profile cards. */
  header: string;
  /** A static version of the header. Equal to `header` if its value is a static image; different if `header` is an animated GIF. */
  headerStatic: string;
  /** Whether the account manually approves follow requests. */
  locked: boolean;
  /** Additional metadata attached to a profile as name-value pairs. */
  fields: AccountField[];
  /** Custom emoji entities to be used when rendering the profile. If none, an empty array will be returned. */
  emojis: CustomEmoji[];
  /** Boolean to indicate that the account performs automated actions */
  bot: boolean;
  /** Indicates that the account represents a Group actor. */
  group: boolean;
  /** Whether the account has opted into discovery features such as the profile directory. */
  discoverable?: boolean | null;
  /** Whether the local user has opted out of being indexed by search engines. */
  noindex?: boolean | null;
  /** Indicates that the profile is currently inactive and that its user has moved to a new account. */
  moved?: Account | null;
  /** An extra entity returned when an account is suspended. **/
  suspended?: boolean | null;
  /** An extra attribute returned only when an account is silenced. If true, indicates that the account should be hidden behind a warning screen. */
  limited?: boolean | null;
  /** When the account was created. */
  createdAt: string;
  /** Time of the last status posted */
  lastStatusAt: string;
  /** How many statuses are attached to this account. */
  statusesCount: number;
  /** The reported followers of this profile. */
  followersCount: number;
  /** The reported follows of this profile. */
  followingCount: number;
  /** Roles that have been granted to this account. */
  roles: Pick<Role, "id" | "name" | "color">[]; // TODO: Create an entity when documentation is updated
  /** https://github.com/mastodon/mastodon/pull/23591 */
  memorial?: boolean | null;
}

/**
 * @see https://docs.joinmastodon.org/entities/Account/#CredentialAccount
 */
export interface AccountCredentials extends Account {
  /**
   * Note the extra `source` property, which is not visible on accounts other than your own.
   * Also note that plain-text is used within `source` and HTML is used for their
   * corresponding properties such as `note` and `fields`.
   */
  source: AccountSource;
  /** The role assigned to the currently authorized user. */
  role: Role;
}
