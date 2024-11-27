import { type Account } from "../account";
import { type ReportCategory } from "../report";
import { type Rule } from "../rule";
import { type Status } from "../status";

/**
 * Admin-level information about a filed report.
 * @see https://docs.joinmastodon.org/entities/admin-report/
 */
export interface Report {
  /** The ID of the report in the database. */
  id: string;
  /** The action taken to resolve this report. */
  actionTaken: boolean;
  /** When an action was taken, if this report is currently resolved. */
  actionTakenAt?: string | null;
  /** The category under which the report is classified */
  category: ReportCategory;
  /** An optional reason for reporting. */
  comment: string;
  /** Whether a report was forwarded to a remote instance. */
  forwarded: boolean;
  /** The time the report was filed. */
  createdAt: string;
  /** The time of last action on this report. */
  updatedAt: string;
  /** The account which filed the report. */
  account: Account;
  /** The account being reported. */
  targetAccount: Account;
  /** The account of the moderator assigned to this report. */
  assignedAccount?: Account | null;
  /** The action taken by the moderator who handled the report. */
  actionTakenByAccount: Account;
  /** Statuses attached to the report, for context. */
  statuses: Status[];
  /** Rules attached to the report, for context. */
  rules: Rule[];
}
