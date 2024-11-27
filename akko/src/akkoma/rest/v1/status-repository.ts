import { type HttpMetaParams } from "../../../interfaces";
import {
  type Account,
  type Context,
  type PreviewCard,
  type ScheduledStatus,
  type Status,
  type StatusEdit,
  type StatusSource,
  type StatusVisibility,
  type Translation,
} from "../../entities/v1";
import { type Paginator } from "../../paginator";

export interface FetchStatusesParams {
  /** The IDs of the Statuses in the database. */
  readonly id: readonly string[];
}

export interface CreateStatusParamsBase {
  /** ID of the status being replied to, if status is a reply */
  readonly inReplyToId?: string | null;
  /** Mark status and attached media as sensitive? */
  readonly sensitive?: boolean | null;
  /** Text to be shown as a warning or subject before the actual content. Statuses are generally collapsed behind this field. */
  readonly spoilerText?: string | null;
  /** Visibility of the posted status. Enumerable oneOf public, unlisted, private, direct. */
  readonly visibility?: StatusVisibility | null;
  /** ISO 639 language code for this status. */
  readonly language?: string | null;
  /** https://github.com/mastodon/mastodon/pull/18350 */
  readonly allowedMentions?: readonly string[] | null;
}

export interface CreateStatusPollParam {
  /** Array of possible answers. If provided, `media_ids` cannot be used, and `poll[expires_in]` must be provided. */
  readonly options: readonly string[];
  /** Duration the poll should be open, in seconds. If provided, media_ids cannot be used, and poll[options] must be provided. */
  readonly expiresIn: number;
  /** Allow multiple choices? */
  readonly multiple?: boolean | null;
  /** Hide vote counts until the poll ends? */
  readonly hideTotals?: boolean | null;
}

export interface CreateStatusParamsWithStatus extends CreateStatusParamsBase {
  /** Text content of the status. If `media_ids` is provided, this becomes optional. Attaching a `poll` is optional while `status` is provided. */
  readonly status: string;
  /** Array of Attachment ids to be attached as media. If provided, `status` becomes optional, and `poll` cannot be used. */
  readonly mediaIds?: never;
  readonly poll?: CreateStatusPollParam | null;
}

export interface CreateStatusParamsWithMediaIds extends CreateStatusParamsBase {
  /** Array of Attachment ids to be attached as media. If provided, `status` becomes optional, and `poll` cannot be used. */
  readonly mediaIds: readonly string[];
  /** Text content of the status. If `media_ids` is provided, this becomes optional. Attaching a `poll` is optional while `status` is provided. */
  readonly status?: string | null;
  readonly poll?: never;
}

export type CreateStatusParams =
  | CreateStatusParamsWithStatus
  | CreateStatusParamsWithMediaIds;

export type CreateScheduledStatusParams = CreateStatusParams & {
  /** ISO 8601 Date-time at which to schedule a status. Providing this parameter will cause ScheduledStatus to be returned instead of Status. Must be at least 5 minutes in the future. */
  readonly scheduledAt?: string | null;
};

interface UpdateStatusMediaAttribute {
  /** The ID of the media attachment to be modified */
  readonly id: string;
  /** A plain-text description of the media, for accessibility purposes. */
  readonly description?: string | null;
  /** Two floating points (x,y), comma-delimited, ranging from -1.0 to 1.0 */
  readonly focus?: string | null;
  /** Custom thumbnail */
  readonly thumbnail?: Blob | string | null;
}

export type UpdateStatusParams = CreateStatusParams & {
  /** https://github.com/mastodon/mastodon/pull/20878 */
  readonly mediaAttributes?: readonly UpdateStatusMediaAttribute[];
};

export interface ReblogStatusParams {
  /** any visibility except limited or direct (i.e. public, unlisted, private). Defaults to public. Currently unused in UI. */
  readonly visibility: StatusVisibility;
}

export interface TranslateStatusParams {
  /** String (ISO 639 language code). The status content will be translated into this language. Defaults to the user’s current locale. */
  readonly lang?: string;
}

export interface StatusRepository {
  /**
   * Obtain information about multiple statuses.
   */
  fetch(params: FetchStatusesParams, meta?: HttpMetaParams): Promise<Status[]>;

  /**
   * Post a new status.
   * @param params Parameters
   * @return Status. When scheduled_at is present, ScheduledStatus is returned instead.
   * @see https://docs.joinmastodon.org/api/rest/statuses/#post-api-v1-statuses
   */
  create(
    params: CreateStatusParams,
    meta?: HttpMetaParams<"json">,
  ): Promise<Status>;
  create(
    params: CreateScheduledStatusParams,
    meta?: HttpMetaParams<"json">,
  ): Promise<ScheduledStatus>;

  $select(id: string): {
    /**
     * View information about a status.
     * @return Status
     * @see https://docs.joinmastodon.org/methods/statuses/
     */
    fetch(meta?: HttpMetaParams): Promise<Status>;

    /**
     * Update a status
     * @param params Parameters
     * @return Status. When scheduled_at is present, ScheduledStatus is returned instead.
     * @see https://docs.joinmastodon.org/api/rest/statuses/#post-api-v1-statuses
     */
    update(
      params: UpdateStatusParams,
      meta?: HttpMetaParams<"json">,
    ): Promise<Status>;

    /**
     * Delete one of your own statuses.
     * @return Status with source text and `media_attachments` or `poll`
     * @see https://docs.joinmastodon.org/methods/statuses/
     */
    remove(meta?: HttpMetaParams): Promise<Status>;

    context: {
      /**
       * View statuses above and below this status in the thread.
       * @return Context
       * @see https://docs.joinmastodon.org/methods/statuses/
       */
      fetch(meta?: HttpMetaParams): Promise<Context>;
    };

    card: {
      /**
       * Preview card
       * @return Card
       * @see https://docs.joinmastodon.org/api/rest/statuses/#get-api-v1-statuses-id-card
       * @deprecated
       */
      fetch(meta?: HttpMetaParams): Promise<PreviewCard>;
    };

    /**
     * Add a status to your favourites list.
     * @return Status
     * @see https://docs.joinmastodon.org/methods/statuses/
     */
    favourite(meta?: HttpMetaParams): Promise<Status>;

    /**
     * Remove a status from your favourites list.
     * @return Status
     * @see https://docs.joinmastodon.org/methods/statuses/
     */
    unfavourite(meta?: HttpMetaParams): Promise<Status>;

    /**
     * Do not receive notifications for the thread that this status is part of. Must be a thread in which you are a participant.
     * @return Status
     * @see https://docs.joinmastodon.org/methods/statuses/
     */
    mute(meta?: HttpMetaParams): Promise<Status>;

    /**
     * Start receiving notifications again for the thread that this status is part of.
     * @return Status
     * @see https://docs.joinmastodon.org/methods/statuses/
     */
    unmute(meta?: HttpMetaParams): Promise<Status>;

    rebloggedBy: {
      /**
       * View who boosted a given status.
       * @return Array of Account
       * @see https://docs.joinmastodon.org/methods/statuses/
       */
      list(meta?: HttpMetaParams): Paginator<Account[]>;
    };

    favouritedBy: {
      /**
       * View who favourited a given status.
       * @return Array of Account
       * @see https://docs.joinmastodon.org/methods/statuses/
       */
      list(meta?: HttpMetaParams): Paginator<Account[]>;
    };

    /**
     * Re-share a status.
     * @return Status
     * @see https://docs.joinmastodon.org/api/rest/statuses/#post-api-v1-statuses-id-reblog
     */
    reblog(
      params?: ReblogStatusParams,
      meta?: HttpMetaParams<"json">,
    ): Promise<Status>;

    /**
     * Undo a re-share of a status.
     * @return Status
     * @see https://docs.joinmastodon.org/methods/statuses/
     */
    unreblog(meta?: HttpMetaParams): Promise<Status>;

    /**
     * Feature one of your own public statuses at the top of your profile.
     * @return Status
     * @see https://docs.joinmastodon.org/methods/statuses/
     */
    pin(meta?: HttpMetaParams): Promise<Status>;

    /**
     * Un-feature a status from the top of your profile.
     * @return Status
     * @see https://docs.joinmastodon.org/methods/statuses/
     */
    unpin(meta?: HttpMetaParams): Promise<Status>;

    /**
     * Privately bookmark a status.
     * @return Status
     * @see https://docs.joinmastodon.org/methods/statuses/
     */
    bookmark(meta?: HttpMetaParams): Promise<Status>;

    /**
     * Remove a status from your private bookmarks.
     * @return Status
     * @see https://docs.joinmastodon.org/methods/statuses/
     */
    unbookmark(meta?: HttpMetaParams): Promise<Status>;

    history: {
      /**
       * Get all known versions of a status, including the initial and current states.
       * @returns StatusEdit
       * @see https://docs.joinmastodon.org/methods/statuses/#history
       */
      list(meta?: HttpMetaParams): Paginator<StatusEdit[]>;
    };

    source: {
      /**
       * Obtain the source properties for a status so that it can be edited.
       * @returns StatusSource
       * @see https://docs.joinmastodon.org/methods/statuses/#source
       */
      fetch(meta?: HttpMetaParams): Promise<StatusSource>;
    };

    /**
     * Translate the status content into some language.
     * @param params Form data parameters
     * @returns Translation
     */
    translate(
      params: TranslateStatusParams,
      meta?: HttpMetaParams,
    ): Promise<Translation>;
  };
}
