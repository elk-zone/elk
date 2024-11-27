import { type HttpMetaParams } from "../../../interfaces";
import { type Account } from "../../entities/v1";
import { type Paginator } from "../../paginator";

export interface ListSuggestionParams {
  /** Integer. Maximum number of results to return. Defaults to 40. */
  readonly limit?: number | null;
}

export interface SuggestionRepository {
  /**
   * Accounts the user has had past positive interactions with, but is not yet following.
   * @param params Parameters
   * @return Array of Accounts
   * @see https://docs.joinmastodon.org/methods/suggestions/#v1
   */
  list(
    params?: ListSuggestionParams,
    meta?: HttpMetaParams,
  ): Paginator<Account[], ListSuggestionParams>;

  $select(id: string): {
    /**
     * Remove an account from follow suggestions.
     * @return N/A
     * @see https://docs.joinmastodon.org/methods/accounts/suggestions/
     */
    remove(id: string, meta?: HttpMetaParams): Promise<void>;
  };
}
