import { type HttpMetaParams } from "../../../interfaces";
import {
  type Account,
  type AccountCredentials,
  type AccountField,
  type AccountSource,
  type FamiliarFollowers,
  type FeaturedTag,
  type IdentityProof,
  type List,
  type Relationship,
  type Status,
  type Token,
} from "../../entities/v1";
import { type Paginator } from "../../paginator";
import { type DefaultPaginationParams } from "../../repository";

export interface FetchAccountsParams {
  /** The IDs of the Accounts in the database. */
  readonly id: readonly string[];
}

export interface CreateAccountParams {
  /** The desired username for the account */
  readonly username: string;
  /** The password to be used for login */
  readonly password: string;
  /** The email address to be used for login */
  readonly email: string;
  /** Whether the user agrees to the local rules, terms, and policies. These should be presented to the user in order to allow them to consent before setting this parameter to TRUE. */
  readonly agreement: boolean;
  /** The language of the confirmation email that will be sent */
  readonly locale: string;
  /** Text that will be reviewed by moderators if registrations require manual approval. */
  readonly reason?: string;
  /** https://github.com/mastodon/mastodon/pull/25342 */
  readonly timeZone?: string;
}

export interface UpdateCredentialsParams {
  /** Whether the account should be shown in the profile directory. */
  readonly discoverable?: boolean;
  /** Whether the account has a bot flag. */
  readonly bot?: boolean;
  /** The display name to use for the profile. */
  readonly displayName?: string | null;
  /** The account bio. */
  readonly note?: string | null;
  /** Avatar image encoded using multipart/form-data */
  readonly avatar?: Blob | string | null;
  /** Header image encoded using multipart/form-data */
  readonly header?: Blob | string | null;
  /** Whether manual approval of follow requests is required. */
  readonly locked?: boolean | null;
  readonly source?: Partial<
    Pick<AccountSource, "privacy" | "sensitive" | "language">
  > | null;
  /** Whether you want to hide followers and followings on your profile  */
  readonly hideCollections?: boolean | null;
  /**
   * Profile metadata `name` and `value`.
   * (By default, max 4 fields and 255 characters per property/value)
   */
  readonly fieldsAttributes?: AccountField[] | null;
}

export interface MuteAccountParams {
  /** Mute notifications in addition to statuses? Defaults to true. */
  readonly notifications?: boolean;
  /** Duration to mute in seconds. Defaults to 0 (indefinite). */
  readonly duration?: number;
}

export interface CreateAccountNoteParams {
  readonly comment: string;
}

export interface ListAccountStatusesParams extends DefaultPaginationParams {
  /** Only return statuses that have media attachments */
  readonly onlyMedia?: boolean | null;
  /** Only return statuses that have been pinned */
  readonly pinned?: boolean | null;
  /** Skip statuses that reply to other statuses */
  readonly excludeReplies?: boolean | null;
  /** Skip statuses that are boosts of other statuses */
  readonly excludeReblogs?: boolean | null;
  /** Only return statuses using a specific hashtag */
  readonly tagged?: string | null;
}

export interface FollowAccountParams {
  /** Receive this account's reblogs in home timeline? Defaults to true */
  readonly reblogs?: boolean | null;
  /** Receive notifications when this account posts a status? Defaults to false */
  readonly notify?: boolean | null;
  /** Array of String (ISO 639-1 language two-letter code). Filter received statuses for these languages. If not provided, you will receive this account's posts in all languages */
  readonly languages?: string[] | null;
}

export interface SearchAccountsParams {
  /** What to search for */
  readonly q: string;
  /** Maximum number of results. Defaults to 40. */
  readonly limit?: number | null;
  /** Attempt WebFinger lookup. Defaults to false. Use this when `q` is an exact address. */
  readonly resolve?: boolean | null;
  /** Only who the user is following. Defaults to false. */
  readonly following?: boolean | null;
  /** Skip the first n results. */
  readonly offset?: number | null;
}

export interface LookupAccountParams {
  readonly acct: string;
}

export interface FetchRelationshipsParams {
  /** Array of account IDs to check */
  readonly id: readonly string[];
  /** Whether relationships should be returned for suspended users, defaults to false. */
  readonly withSuspended?: boolean | null;
}

export interface AccountRepository {
  fetch(params: FetchAccountsParams, meta?: HttpMetaParams): Promise<Account[]>;

  $select(id: string): {
    /**
     * View information about a profile.
     * @return Account
     * @see https://docs.joinmastodon.org/methods/accounts/
     */
    fetch(meta?: HttpMetaParams): Promise<Account>;

    /**
     * Follow the given account.
     * @param id The id of the account in the database
     * @param params Parameters
     * @return Relationship
     * @see https://docs.joinmastodon.org/methods/accounts/
     */
    follow(
      params?: FollowAccountParams,
      meta?: HttpMetaParams<"json">,
    ): Promise<Relationship>;

    /**
     * Unfollow the given account
     * @param id The id of the account in the database
     * @return Relationship
     * @see https://docs.joinmastodon.org/methods/accounts/
     */
    unfollow(
      params?: FollowAccountParams,
      meta?: HttpMetaParams<"json">,
    ): Promise<Relationship>;

    /**
     * Block the given account. Clients should filter statuses from this account if received (e.g. due to a boost in the Home timeline)
     * @return Relationship
     * @see https://docs.joinmastodon.org/methods/accounts/
     */
    block(meta?: HttpMetaParams): Promise<Relationship>;

    /**
     * Unblock the given account.
     * @return Relationship
     * @see https://docs.joinmastodon.org/methods/accounts/
     */
    unblock(meta?: HttpMetaParams): Promise<Relationship>;

    /**
     * Add the given account to the user's featured profiles. (Featured profiles are currently shown on the user's own public profile.)
     * @return Relationship
     * @see https://docs.joinmastodon.org/methods/accounts#pin
     */
    pin(meta?: HttpMetaParams): Promise<Relationship>;

    /**
     * Remove the given account from the user's featured profiles.
     * @return Relationship
     * @see https://docs.joinmastodon.org/methods/accounts/
     */
    unpin(meta?: HttpMetaParams): Promise<Relationship>;

    /**
     * Mute the given account. Clients should filter statuses and notifications from this account, if received (e.g. due to a boost in the Home timeline).
     * @param params Parameter
     * @return Relationship
     * @see https://docs.joinmastodon.org/methods/accounts/
     */
    mute(
      params?: MuteAccountParams,
      meta?: HttpMetaParams<"json">,
    ): Promise<Relationship>;

    /**
     * Unmute the given account.
     * @return Relationship
     * @see https://docs.joinmastodon.org/methods/accounts/
     */
    unmute(meta?: HttpMetaParams): Promise<Relationship>;

    /**
     * @returns N/A
     */
    removeFromFollowers(meta?: HttpMetaParams): Promise<void>;

    featuredTags: {
      /**
       * Get featured tag of the account
       * @return FeaturedTags
       */
      list(meta?: HttpMetaParams): Paginator<FeaturedTag[]>;
    };

    note: {
      /**
       * Add personal note to the account
       * @param id ID of the account
       * @param param Parameters
       * @return Relationship
       */
      create(
        params: CreateAccountNoteParams,
        meta?: HttpMetaParams<"json">,
      ): Promise<Relationship>;
    };

    identityProofs: {
      /**
       * Identity proofs
       * @return Array of IdentityProof
       * @see https://github.com/tootsuite/mastodon/pull/10297
       */
      list(meta?: HttpMetaParams): Paginator<IdentityProof[]>;
    };

    lists: {
      /**
       * Fetch the list with the given ID. Used for verifying the title of a list.
       * @return Array of List
       * @see https://docs.joinmastodon.org/methods/timelines/lists/
       */
      list(meta?: HttpMetaParams): Paginator<List[]>;
    };

    followers: {
      /**
       * Accounts which follow the given account, if network is not hidden by the account owner.
       * @param params Parameters
       * @return Array of Account
       * @see https://docs.joinmastodon.org/methods/accounts/
       */
      list(
        params?: DefaultPaginationParams,
        meta?: HttpMetaParams,
      ): Paginator<Account[], DefaultPaginationParams>;
    };

    following: {
      /**
       * Accounts which the given account is following, if network is not hidden by the account owner.
       * @param params Parameters
       * @return Array of Account
       * @see https://docs.joinmastodon.org/methods/accounts/
       */
      list(
        params?: DefaultPaginationParams,
        meta?: HttpMetaParams,
      ): Paginator<Account[], DefaultPaginationParams>;
    };

    statuses: {
      /**
       * Statuses posted to the given account.
       * @param params Parameters
       * @return Array of Status
       * @see https://docs.joinmastodon.org/methods/accounts/
       */
      list(
        params?: ListAccountStatusesParams,
        meta?: HttpMetaParams,
      ): Paginator<Status[], ListAccountStatusesParams>;
    };
  };

  /**
   * This method allows to quickly convert a username of a known account to an ID that can be used with the REST API, or to check if a username is available for sign-up
   * @param params Parameters
   * @return Account
   */
  lookup(params: LookupAccountParams, meta?: HttpMetaParams): Promise<Account>;

  /**
   * Creates a user and account records. Returns an account access token
   * for the app that initiated the request. The app should save this token for later,
   * and should wait for the user to confirm their account by clicking a link in their email inbox.
   * @param params Parameters
   * @return Token
   * @see https://docs.joinmastodon.org/methods/accounts/#create
   */
  create(
    params: CreateAccountParams,
    meta?: HttpMetaParams<"multipart-form">,
  ): Promise<Token>;

  /**
   * Test to make sure that the user token works.
   * @return the user's own Account with Source
   * @see https://docs.joinmastodon.org/methods/accounts/
   */
  verifyCredentials(meta?: HttpMetaParams): Promise<AccountCredentials>;

  /**
   *  Update the user's display and preferences.
   * @param params Parameters
   * @return the user's own Account with Source
   * @see https://docs.joinmastodon.org/methods/accounts/
   */
  updateCredentials(
    params: UpdateCredentialsParams,
    meta?: HttpMetaParams<"multipart-form">,
  ): Promise<AccountCredentials>;

  relationships: {
    /**
     * Find out whether a given account is followed, blocked, muted, etc.
     * @return Array of Relationship
     * @see https://docs.joinmastodon.org/methods/accounts/
     */
    fetch(
      params: FetchRelationshipsParams,
      meta?: HttpMetaParams,
    ): Promise<Relationship[]>;
  };

  search: {
    /**
     * Search for matching accounts by username or display name.
     * @param params Parameters
     * @return Array of Account
     * @see https://docs.joinmastodon.org/methods/accounts/
     */
    list(
      params?: SearchAccountsParams,
      meta?: HttpMetaParams,
    ): Paginator<Account[], SearchAccountsParams>;
  };

  familiarFollowers: {
    /**
     * Obtain a list of all accounts that follow a given account, filtered for accounts you follow.
     * @returns Array of FamiliarFollowers
     */
    fetch(id: string[], meta?: HttpMetaParams): Promise<FamiliarFollowers[]>;
  };
}
