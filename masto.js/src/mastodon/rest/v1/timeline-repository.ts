import { type HttpMetaParams } from "../../../interfaces";
import { type Status } from "../../entities/v1";
import { type Paginator } from "../../paginator";
import { type DefaultPaginationParams } from "../../repository";

export interface ListTimelineParams extends DefaultPaginationParams {
  /** Show only local statuses? Defaults to false. */
  readonly local?: boolean | null;
  /** Show only statuses with media attached? Defaults to false. */
  readonly onlyMedia?: boolean | null;
  /** Remote only */
  readonly remote?: boolean | null;
}

export interface ListLinkTimelineParams extends ListTimelineParams {
  /** The URL of the trending article. */
  readonly url: string;
}

export interface TimelineRepository {
  home: {
    /**
     * View statuses from followed users.
     * @param params Parameters
     * @return Array of Status
     * @see https://docs.joinmastodon.org/methods/timelines/
     */
    list(
      params?: ListTimelineParams,
      meta?: HttpMetaParams,
    ): Paginator<Status[], ListTimelineParams>;
  };

  public: {
    /**
     * Public timeline
     * @param params Parameters
     * @return Array of Status
     * @see https://docs.joinmastodon.org/methods/timelines/
     */
    list(
      params?: ListTimelineParams,
      meta?: HttpMetaParams,
    ): Paginator<Status[], ListTimelineParams>;
  };

  tag: {
    $select(hashtag: string): {
      /**
       * View public statuses containing the given hashtag.
       * @param hashtag Content of a #hashtag, not including # symbol.
       * @param params Parameters
       * @return Array of Status
       * @see https://docs.joinmastodon.org/methods/timelines#tag
       */
      list(
        params?: ListTimelineParams,
        meta?: HttpMetaParams,
      ): Paginator<Status[], ListTimelineParams>;
    };
  };

  list: {
    $select(id: string): {
      /**
       * View statuses in the given list timeline.
       * @param id Local ID of the list in the database.
       * @param params Query parameter
       * @return Array of Status
       * @see https://docs.joinmastodon.org/methods/timelines/
       */
      list(
        params?: ListTimelineParams,
        meta?: HttpMetaParams,
      ): Paginator<Status[], ListTimelineParams>;
    };
  };

  direct: {
    /**
     * View statuses with a “direct” privacy, from your account or in your notifications.
     * @returns Array of Status
     * @see https://docs.joinmastodon.org/methods/timelines/
     */
    /* istanbul ignore next */
    list(
      params?: ListTimelineParams,
      meta?: HttpMetaParams,
    ): Paginator<Status[], ListTimelineParams>;
  };

  link: {
    /**
     * View public statuses containing a link to the specified currently-trending article. This only lists statuses from people who have opted in to discoverability features.
     * @returns Array of {@link Status}
     * @see https://docs.joinmastodon.org/methods/timelines/#link
     */
    list(
      params: ListLinkTimelineParams,
      meta?: HttpMetaParams,
    ): Paginator<Status[], ListLinkTimelineParams>;
  };
}
