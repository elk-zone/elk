import { type HttpMetaParams } from "../../../interfaces";
import { type Search } from "../../entities/v1";
import { type Paginator } from "../../paginator";
import { type DefaultPaginationParams } from "../../repository";

export type SearchType = "accounts" | "hashtags" | "statuses";

export interface SearchParams extends DefaultPaginationParams {
  /** Attempt WebFinger lookup. Defaults to false. */
  readonly q: string;
  /** Enum(accounts, hashtags, statuses) */
  readonly type?: SearchType | null;
  /** Attempt WebFinger look-up */
  readonly resolve?: boolean | null;
  /** If provided, statuses returned will be authored only by this account */
  readonly accountId?: string | null;
}

export interface SearchRepository {
  /**
   * @deprecated Use `list` instead
   */
  fetch(params: SearchParams, meta?: HttpMetaParams): Search;

  /**
   * Search, but hashtags is an array of strings instead of an array of Tag.
   * @param params Parameters
   * @return Results
   * @see https://docs.joinmastodon.org/methods/search/
   */
  list(
    params: SearchParams,
    meta?: HttpMetaParams,
  ): Paginator<Search, SearchParams>;
}
