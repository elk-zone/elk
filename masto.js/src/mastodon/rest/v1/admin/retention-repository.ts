import { type HttpMetaParams } from "../../../../interfaces";
import { type Admin } from "../../../entities/v1";
import { type CohortFrequency } from "../../../entities/v1/admin/cohort";

export interface CreateRetentionParams {
  /** String (ISO 8601 Datetime). The start date for the time period. If a time is provided, it will be ignored. */
  readonly startAt: string;
  /** String (ISO 8601 Datetime). The end date for the time period. If a time is provided, it will be ignored. */
  readonly endAt: string;
  /** String (Enumerable oneOf). Specify whether to use `day` or `month` buckets. If any other value is provided, defaults to `day`. */
  readonly frequency: CohortFrequency;
}

export interface RetentionRepository {
  /**
   * Generate a retention data report for a given time period and bucket.
   * @see https://docs.joinmastodon.org/methods/admin/retention/#create
   */
  create(
    params: CreateRetentionParams,
    meta?: HttpMetaParams<"json">,
  ): Promise<Admin.Cohort[]>;
}
