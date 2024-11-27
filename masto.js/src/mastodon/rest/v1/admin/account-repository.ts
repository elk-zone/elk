import { type HttpMetaParams } from "../../../../interfaces";
import { type Admin } from "../../../entities/v1";
import { type Paginator } from "../../../paginator";
import { type DefaultPaginationParams } from "../../../repository";

export interface ListAccountsParams extends DefaultPaginationParams {
  /** Filter for local accounts? */
  readonly local?: boolean | null;
  /** Filter for remote accounts? */
  readonly remote?: boolean | null;
  /** Filter by the given domain */
  readonly byDomain?: string | null;
  /** Filter for currently active accounts? */
  readonly active?: boolean | null;
  /** Filter for currently pending accounts? */
  readonly pending?: boolean | null;
  /** Filter for currently disabled accounts? */
  readonly disabled?: boolean | null;
  /** Filter for currently silenced accounts? */
  readonly silenced?: boolean | null;
  /** Filter for currently suspended accounts? */
  readonly suspended?: boolean | null;
  /** Boolean. Filter for accounts force-marked as sensitive? */
  readonly sensitized?: boolean | null;
  /** Username to search for */
  readonly username?: string | null;
  /** Display name to search for */
  readonly displayName?: string | null;
  /** Lookup a user with this email */
  readonly email?: string | null;
  /** Lookup users by this IP address */
  readonly ip?: string | null;
  /** Filter for staff accounts? */
  readonly staff?: boolean | null;
}

// prettier-ignore
export type AccountActionType =
  | 'none'
  | 'disable'
  | 'silence'
  | 'sensitive'
  | 'suspend';

export interface CreateActionParams {
  /** Type of action to be taken. Enumerable oneOf: `none` `disable` `silence` `suspend` */
  readonly type?: AccountActionType;
  /** ID of an associated report that caused this action to be taken */
  readonly reportId?: string;
  /** ID of a preset warning */
  readonly warningPresetId?: string | null;
  /** Additional text for clarification of why this action was taken */
  readonly text?: string | null;
  /** Whether an email should be sent to the user with the above information. */
  readonly sendEmailNotification?: boolean | null;
}

export interface AccountRepository {
  /**
   * View accounts matching certain criteria for filtering, up to 100 at a time.
   * Pagination may be done with the HTTP Link header in the response.
   * @param params Parameters
   * @return Array of AdminAccount
   * @see https://docs.joinmastodon.org/methods/admin/
   */
  list(
    params?: ListAccountsParams,
    meta?: HttpMetaParams,
  ): Paginator<Admin.Account[], ListAccountsParams>;

  $select(id: string): {
    /**
     * View admin-level information about the given account.
     * @return AdminAccount
     * @see https://docs.joinmastodon.org/methods/admin/
     */
    fetch(meta?: HttpMetaParams): Promise<Admin.Account>;

    action: {
      /**
       * Perform an action against an account and log this action in the moderation history.
       * @param params Params
       * @return Account
       * @see https://docs.joinmastodon.org/methods/admin/accounts/#action
       */
      create(
        params: CreateActionParams,
        meta?: HttpMetaParams<"json">,
      ): Promise<void>;
    };

    /**
     * Approve the given local account if it is currently pending approval.
     * @return AdminAccount
     * @see https://docs.joinmastodon.org/methods/admin/
     */
    approve(meta?: HttpMetaParams): Promise<Admin.Account>;

    /**
     * Reject the given local account if it is currently pending approval.
     * @return AdminAccount
     * @see https://docs.joinmastodon.org/methods/admin/
     */
    reject(meta?: HttpMetaParams): Promise<Admin.Account>;

    /**
     * Re-enable a local account whose login is currently disabled.
     * @return AdminAccount
     * @see https://docs.joinmastodon.org/methods/admin/
     */
    enable(meta?: HttpMetaParams): Promise<Admin.Account>;

    /**
     * Unsilence a currently silenced account.
     * @return AdminAccount
     * @see https://docs.joinmastodon.org/methods/admin/
     */
    unsilence(meta?: HttpMetaParams): Promise<Admin.Account>;

    /**
     * Unsuspend a currently suspended account.
     * @return AdminAccount
     * @see https://docs.joinmastodon.org/methods/admin/
     */
    unsuspend(meta?: HttpMetaParams): Promise<Admin.Account>;

    /**
     * Unmark an account as sensitive
     * @return AdminAccount
     * @see https://docs.joinmastodon.org/methods/admin/accounts/#unsensitive
     */
    unsensitive(meta?: HttpMetaParams): Promise<Admin.Account>;
  };
}
