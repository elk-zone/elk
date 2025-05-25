import { type HttpMetaParams } from "../../../interfaces";
import { type Filter, type FilterContext } from "../../entities/v1";
import { type Paginator } from "../../paginator";

export interface CreateFilterParams {
  /** Text to be filtered */
  readonly phrase: string;
  /**
   * Array of enumerable strings `home`, `notifications`, `public`, `thread`.
   * At least one context must be specified.
   */
  readonly context: readonly FilterContext[] | null;
  /** Should the server irreversibly drop matching entities from home and notifications? */
  readonly irreversible?: boolean | null;
  /** Consider word boundaries? */
  readonly wholeWord?: boolean | null;
  /** ISO 8601 Date-time for when the filter expires. Otherwise, null for a filter that doesn't expire. */
  readonly expiresIn?: number | null;
}

export type UpdateFilterParams = CreateFilterParams;

export interface FilterRepository {
  /**
   * View all filters
   * @return Filter
   * @see https://docs.joinmastodon.org/methods/accounts/filters/
   */
  list(meta?: HttpMetaParams): Paginator<Filter[]>;

  $select(id: string): {
    /**
     * View a single filter
     * @return Returns Filter
     * @see https://docs.joinmastodon.org/methods/accounts/filters/
     */
    fetch(meta?: HttpMetaParams): Promise<Filter>;

    /**
     * Update a filter
     * @param params Parameters
     * @return Filter
     * @see https://docs.joinmastodon.org/methods/accounts/filters/
     */
    update(
      params?: UpdateFilterParams,
      meta?: HttpMetaParams<"json">,
    ): Promise<Filter>;

    /**
     * Remove a filter
     * @return N/A
     * @see https://docs.joinmastodon.org/methods/accounts/filters/
     */
    remove(meta?: HttpMetaParams): Promise<void>;
  };

  /**
   * Create a filter
   * @param params Parameters
   * @return Filter
   * @see https://docs.joinmastodon.org/methods/accounts/filters/
   */
  create(
    params?: CreateFilterParams,
    meta?: HttpMetaParams<"json">,
  ): Promise<Filter>;
}
