import { type HttpMetaParams } from "../../../interfaces";
import { type Suggestion } from "../../entities/v1";
import { type Paginator } from "../../paginator";

export interface ListSuggestionsParams {
  /** Integer. Maximum number of results to return. Defaults to 40. */
  readonly limit?: number | null;
}

export interface SuggestionRepository {
  /**
   * View follow suggestions.
   * Accounts that are promoted by staff, or that the user has had past positive interactions with, but is not yet following.
   * @param params
   * @returns
   */
  list(
    params?: ListSuggestionsParams,
    meta?: HttpMetaParams,
  ): Paginator<Suggestion[], ListSuggestionsParams>;
}
