import { type HttpMetaParams } from "../../../interfaces";
import { type Report, type ReportCategory } from "../../entities/v1";

export interface ReportAccountParams {
  /** ID of the account to report */
  readonly accountId: string;
  /** Array of Statuses to attach to the report, for context */
  readonly statusIds?: readonly string[] | null;
  /** Reason for the report (default max 1000 characters) */
  readonly comment?: string | null;
  /** If the account is remote, should the report be forwarded to the remote admin? */
  readonly forward?: boolean | null;
  /** category can be one of: spam, violation, other (default) */
  readonly category?: ReportCategory | null;
  /** must reference rules returned in GET /api/v1/instance */
  readonly ruleIds?: readonly string[] | null;
  /** https://github.com/mastodon/mastodon/pull/25866 */
  readonly forwardToDomains?: readonly string[] | null;
}

export interface ReportRepository {
  /**
   * File a report
   * @param params Parameters
   * @return Report
   * @see https://docs.joinmastodon.org/methods/accounts/reports/
   */
  create(
    params: ReportAccountParams,
    meta?: HttpMetaParams<"json">,
  ): Promise<Report>;
}
