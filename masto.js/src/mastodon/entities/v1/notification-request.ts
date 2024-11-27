import { type Account } from "./account";
import { type Status } from "./status";

export interface NotificationRequest {
  /** The id of the notification request in the database. */
  id: string;
  /** The timestamp of the notification request, i.e. when the first filtered notification from that user was created. */
  createdAt: string;
  /** The timestamp of when the notification request was last updated. */
  updatedAt: string;
  /** The account that performed the action that generated the filtered notifications. */
  account: Account;
  /** How many of this account’s notifications were filtered. */
  notificationsCount: number;
  /** Most recent status associated with a filtered notification from that account. */
  lastStatus?: Status | null;
}
