import { type HttpMetaParams } from "../../../interfaces";
import { type Status, type Tag, type TrendLink } from "../../entities/v1";
import { type Paginator } from "../../paginator";
import { type DefaultPaginationParams } from "../../repository";

export interface ListTrendsParams {
  /** Maximum number of results to return. Defaults to 10. */
  readonly limit: number;
}

export interface TrendRepository {
  statuses: {
    /**
     * View trending statuses
     * @returns Array of Status
     * @see https://docs.joinmastodon.org/methods/trends/#statuses
     */
    list(
      params?: DefaultPaginationParams,
      meta?: HttpMetaParams,
    ): Paginator<Status[], DefaultPaginationParams>;
  };

  links: {
    /**
     * Links that have been shared more than others.
     * @see https://docs.joinmastodon.org/methods/trends/#links
     */
    list(
      params?: DefaultPaginationParams,
      meta?: HttpMetaParams,
    ): Paginator<TrendLink[], DefaultPaginationParams>;
  };

  tags: {
    /**
     * Tags that are being used more frequently within the past week.
     * @param params Parameters
     * @return Array of Tag with History
     * @see https://docs.joinmastodon.org/methods/trends/#tags
     */
    list(
      params?: ListTrendsParams,
      meta?: HttpMetaParams,
    ): Paginator<Tag[], ListTrendsParams>;
  };
}
