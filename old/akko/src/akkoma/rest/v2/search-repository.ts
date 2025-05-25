import { type HttpMetaParams } from "../../../interfaces";
import { type Search } from "../../entities/v2";
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
  /** Filter out unreviewed tags? Defaults to false. Use true when trying to find trending tags. */
  readonly excludeUnreviewed?: boolean | null;
  /** Only include accounts that the user is following. Defaults to false. */
  readonly following?: boolean | null;
  /** Skip the first n results. */
  readonly offset?: number | null;
}

export interface SearchRepository {
  /**
   * @deprecated Use `list` instead
   */
  fetch(params: SearchParams, meta?: HttpMetaParams): Search;

  /**
   * Perform a search
   * @param params Parameters
   * @return Results
   * @see https://docs.joinmastodon.org/methods/search/
   */
  list(
    params: SearchParams,
    meta?: HttpMetaParams,
  ): Paginator<Search, SearchParams>;
}
