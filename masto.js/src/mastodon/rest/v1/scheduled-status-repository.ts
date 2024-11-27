import { type HttpMetaParams } from "../../../interfaces";
import { type ScheduledStatus } from "../../entities/v1";
import { type Paginator } from "../../paginator";
import { type DefaultPaginationParams } from "../../repository";

export interface UpdateScheduledStatusParams {
  /** ISO 8601 Date-time at which the status will be published. Must be at least 5 minutes into the future. */
  readonly scheduledAt: string;
}

export interface ScheduledStatusRepository {
  /**
   * View scheduled statuses
   * @param params Parameters
   * @return Array of ScheduledStatus
   * @see https://docs.joinmastodon.org/methods/statuses/scheduled_statuses/
   */
  list(
    params?: DefaultPaginationParams,
    meta?: HttpMetaParams,
  ): Paginator<ScheduledStatus[], DefaultPaginationParams>;

  $select(id: string): {
    /**
     * View a single scheduled status
     * @return ScheduledStatus
     * @see https://docs.joinmastodon.org/methods/statuses/scheduled_statuses/
     */
    fetch(meta?: HttpMetaParams): Promise<ScheduledStatus>;

    /**
     * Update Scheduled status
     * @param params Parameters
     * @return ScheduledStatus
     * @see https://docs.joinmastodon.org/api/rest/scheduled-statuses/#put-api-v1-scheduled-statuses-id
     */
    update(
      params: UpdateScheduledStatusParams,
      meta?: HttpMetaParams<"json">,
    ): Promise<ScheduledStatus>;

    /**
     * Cancel a scheduled status
     * @return N/A
     * @see https://docs.joinmastodon.org/methods/statuses/scheduled_statuses/
     */
    remove(meta?: HttpMetaParams): Promise<void>;
  };
}
