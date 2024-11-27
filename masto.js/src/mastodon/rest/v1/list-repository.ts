import { type HttpMetaParams } from "../../../interfaces";
import { type Account, type List } from "../../entities/v1";
import { type Paginator } from "../../paginator";
import { type DefaultPaginationParams } from "../../repository";

export interface CreateListParams {
  /** The title of the list to be created. */
  readonly title: string;
  /** https://github.com/mastodon/mastodon/pull/22048/files */
  readonly exclusive?: boolean;
}

export type UpdateListParams = CreateListParams;

export interface AddListAccountsParams {
  /** Array of account IDs */
  readonly accountIds: readonly string[];
}

export type RemoveListAccountsParams = AddListAccountsParams;

export interface ListRepository {
  $select(id: string): {
    /**
     * Fetch the list with the given ID. Used for verifying the title of a list.
     * @return List
     * @see https://docs.joinmastodon.org/methods/timelines/lists/
     */
    fetch(meta?: HttpMetaParams): Promise<List>;

    /**
     * Change the title of a list.
     * @param params Parameters
     * @return List
     * @see https://docs.joinmastodon.org/methods/timelines/lists/
     */
    update(
      params: UpdateListParams,
      meta?: HttpMetaParams<"json">,
    ): Promise<List>;

    /**
     * Delete a list
     * @param id ID of the list in the database
     * @return N/A
     * @see https://docs.joinmastodon.org/methods/timelines/lists/
     */
    remove(meta?: HttpMetaParams): Promise<void>;

    accounts: {
      /**
       * View accounts in list
       * @param id ID of the list in the database
       * @param params Parameters
       * @return Array of Account
       * @see https://docs.joinmastodon.org/methods/timelines/lists#accounts
       */
      list(
        params?: DefaultPaginationParams,
        meta?: HttpMetaParams,
      ): Paginator<Account[], DefaultPaginationParams>;

      /**
       * Add accounts to the given list. Note that the user must be following these accounts.
       * @param id ID of the list in the database
       * @param params Parameters
       * @return N/A
       * @see https://docs.joinmastodon.org/methods/timelines/lists#accounts-add
       */
      create(
        params: AddListAccountsParams,
        meta?: HttpMetaParams<"json">,
      ): Promise<void>;

      /**
       * Remove accounts from the given list.
       * @param id ID of the list in the database
       * @param params Parameters
       * @return N/A
       * @see https://docs.joinmastodon.org/methods/timelines/lists#accounts-remove
       */
      remove(
        params: RemoveListAccountsParams,
        meta?: HttpMetaParams<"json">,
      ): Promise<void>;
    };
  };

  /**
   * Fetch all lists that the user owns.
   * @return Array of List
   * @see https://docs.joinmastodon.org/methods/timelines/lists/
   */
  list(meta?: HttpMetaParams): Paginator<List[]>;

  /**
   * Create a new list.
   * @param params Parameters
   * @return List
   * @see https://docs.joinmastodon.org/methods/timelines/lists/
   */
  create(
    params: CreateListParams,
    meta?: HttpMetaParams<"json">,
  ): Promise<List>;
}
