import { type Account } from "./account";

export type ReportCategory = "spam" | "violation" | "legal" | "other";

/**
 * Reports filed against users and/or statuses, to be taken action on by moderators.
 * @see https://docs.joinmastodon.org/entities/Report/
 */
export interface Report {
  /** The ID of the report in the database. */
  id: string;
  /** Whether an action was taken yet. */
  actionTaken: boolean;
  /** When an action was taken against the report. */
  actionTakenAt?: string | null;
  /**
   * The generic reason for the report.
   *
   * `spam` = Unwanted or repetitive content
   *
   * `violation` = A specific rule was violated
   *
   * `other` = Some other reason
   */
  category: ReportCategory;
  /** The reason for the report. */
  comment: string;
  /** Whether the report was forwarded to a remote domain */
  forwarded: boolean;
  /** When the report was created */
  createdAt: string;
  /** IDs of statuses that have been attached to this report for additional context. */
  statusIds?: string[] | null;
  /** IDs of the rules that have been cited as a violation by this report. */
  ruleIds?: string[] | null;
  /** The account that was reported. */
  targetAccount: Account;
}
