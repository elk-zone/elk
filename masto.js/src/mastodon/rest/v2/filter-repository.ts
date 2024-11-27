import { type HttpMetaParams } from "../../../interfaces";
import { type FilterKeyword, type FilterStatus } from "../../entities/v1";
import {
  type Filter,
  type FilterAction,
  type FilterContext,
} from "../../entities/v2";
import { type Paginator } from "../../paginator";

export interface CreateFilterParams {
  /** String. The name of the filter group. */
  readonly title: string;
  /** Array of String. Where the filter should be applied. Specify at least one of home, notifications, public, thread, account. */
  readonly context: readonly FilterContext[] | null;
  /** String. The policy to be applied when the filter is matched. Specify warn or hide. */
  readonly filterAction?: FilterAction | null;
  /** Integer. How many seconds from now should the filter expire? */
  readonly expiresIn?: number | null;

  readonly keywordsAttributes?: {
    /** String. A keyword to be added to the newly-created filter group. */
    readonly keyword?: string | null;
    /** Boolean. Whether the keyword should consider word boundaries. */
    readonly wholeWord?: boolean | null;
  }[];
}

export interface UpdateFilterParams {
  /** String. The name of the filter group. */
  readonly title?: string;
  /** Array of String. Where the filter should be applied. Specify at least one of home, notifications, public, thread, account. */
  readonly context?: readonly FilterContext[] | null;
  /** String. The policy to be applied when the filter is matched. Specify warn or hide. */
  readonly filterAction?: FilterAction | null;
  /** Integer. How many seconds from now should the filter expire? */
  readonly expiresIn?: number | null;

  readonly keywordsAttributes?: readonly {
    /** String. Provide the ID of an existing keyword to modify it, instead of creating a new keyword. */
    readonly id?: string | null;
    /** String. A keyword to be added to the newly-created filter group. */
    readonly keyword?: string | null;
    /** Boolean. Whether the keyword should consider word boundaries. */
    readonly wholeWord?: boolean | null;
    /** Boolean. If true, will remove the keyword with the given ID */
    readonly _destroy?: boolean | null;
  }[];
}

export interface CreateFilterKeywordParams {
  /** String. The keyword to be added to the filter group. */
  readonly keyword: string;
  /** Boolean. Whether the keyword should consider word boundaries. */
  readonly wholeWord?: boolean | null;
}

export type UpdateFilterKeywordParams = CreateFilterKeywordParams;

export interface CreateFilterStatusParams {
  readonly statusId: string;
}

export interface FilterRepository {
  /**
   * View all filters
   * @return Array of Filter
   * @see https://docs.joinmastodon.org/methods/filters/#get
   */
  list(meta?: HttpMetaParams): Paginator<Filter[]>;

  /**
   * Create a filter group with the given parameters.
   * @param params Parameters
   * @return Filter
   * @see https://docs.joinmastodon.org/methods/filters/#create
   */
  create(
    params?: CreateFilterParams,
    meta?: HttpMetaParams<"json">,
  ): Promise<Filter>;

  $select(id: string): {
    /**
     * Obtain a single filter group owned by the current user.
     * @return Filter
     * @see https://docs.joinmastodon.org/methods/filters/#get-one
     */
    fetch(meta?: HttpMetaParams): Promise<Filter>;

    /**
     * Update a filter group with the given parameters.
     * @param params Parameters
     * @return Filter
     * @see https://docs.joinmastodon.org/methods/filters/#update
     */
    update(
      params?: UpdateFilterParams,
      meta?: HttpMetaParams<"json">,
    ): Promise<Filter>;

    /**
     * Delete a filter group with the given id.
     * @return N/A
     * @see https://docs.joinmastodon.org/methods/filters/#delete
     */
    remove(meta?: HttpMetaParams): Promise<void>;

    keywords: {
      /**
       * Add the given keyword to the specified filter group
       * @param id String. The ID of the Filter in the database.
       * @param params Parameters
       * @return FilterKeywords
       * @see https://docs.joinmastodon.org/methods/filters/#keywords-create
       */
      create(
        params: CreateFilterKeywordParams,
        meta?: HttpMetaParams<"json">,
      ): Promise<FilterKeyword>;

      /**
       * List all keywords attached to the current filter group.
       * @returns Array of FilterKeyword
       * @see https://docs.joinmastodon.org/methods/filters/#keywords-get
       */
      list(meta?: HttpMetaParams): Paginator<FilterKeyword[]>;
    };

    statuses: {
      /**
       * Obtain a list of all status filters within this filter group.
       * @returns Array of FilterStatus
       * @see https://docs.joinmastodon.org/methods/filters/#statuses-get
       */
      list(meta?: HttpMetaParams): Paginator<FilterStatus[]>;

      /**
       * Add a status filter to the current filter group.
       * @param params
       * @returns FilterStatus
       * @see https://docs.joinmastodon.org/methods/filters/#statuses-add
       */
      create(
        params: CreateFilterStatusParams,
        meta?: HttpMetaParams<"json">,
      ): Promise<FilterStatus>;
    };
  };

  keywords: {
    $select(id: string): {
      /**
       * Get one filter keyword by the given id.
       * @returns FilterKeyword
       * @see https://docs.joinmastodon.org/methods/filters/#keywords-get-one
       */
      fetch(meta?: HttpMetaParams): Paginator<FilterKeyword>;

      /**
       * Update the given filter keyword.
       * @param params Parameters
       * @return FilterKeywords
       * @see https://docs.joinmastodon.org/methods/filters/#keywords-update
       */
      update(
        params: CreateFilterKeywordParams,
        meta?: HttpMetaParams<"json">,
      ): Promise<FilterKeyword>;

      /**
       * Deletes the given filter keyword.
       * @returns empty object
       * @see https://docs.joinmastodon.org/methods/filters/#keywords-delete
       */
      remove(meta?: HttpMetaParams): Promise<void>;
    };
  };

  statuses: {
    $select(id: string): {
      /**
       * Obtain a single status filter.
       * @returns FilterStatus
       * @see https://docs.joinmastodon.org/methods/filters/#statuses-get-one
       */
      fetch(): Promise<FilterStatus>;

      /**
       * @returns FilterStatus
       * @see https://docs.joinmastodon.org/methods/filters/#statuses-get-one
       */
      remove(): Promise<FilterStatus>;
    };
  };
}
