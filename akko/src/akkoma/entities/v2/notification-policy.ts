export type NotificationPolicyType = "accept" | "filter" | "drop";

/**
 * Represents the notification filtering policy of the user.
 */
export interface NotificationPolicy {
  /** Whether to filter notifications from accounts the user is not following. */
  forNotFollowing: NotificationPolicyType;
  /** Whether to filter notifications from accounts that are not following the user. */
  forNotFollowers: NotificationPolicyType;
  /** Whether to filter notifications from accounts created in the past 30 days. */
  forNewAccounts: NotificationPolicyType;
  /** Whether to filter notifications from private mentions. Replies to private mentions initiated by the user, as well as accounts the user follows, are never filtered. */
  forPrivateMentions: NotificationPolicyType;
  /** Whether to accept, filter or drop notifications from accounts that were limited by a moderator. drop will prevent creation of the notification object altogether (without preventing the underlying activity), filter will cause it to be marked as filtered, and accept will not affect its processing. Type: String (one of accept, filter or drop) */
  forLimitedAccounts: NotificationPolicyType;
  /** Summary of the filtered notifications */
  summary: {
    /** Number of different accounts from which the user has non-dismissed filtered notifications. Capped at 100. Type: Integer */
    pendingRequestsCount: number;
    /** Number of total non-dismissed filtered notifications. May be inaccurate.  */
    pendingNotificationsCount: number;
  };
}
