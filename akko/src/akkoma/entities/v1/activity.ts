/**
 * Represents a weekly bucket of instance activity.
 * @see https://docs.joinmastodon.org/entities/activity/
 */
export interface Activity {
  /** Midnight at the first day of the week. */
  week: string;
  /** Statuses created since the week began. */
  statuses: string;
  /** User logins since the week began. */
  logins: string;
  /** User registrations since the week began. */
  registrations: string;
}
