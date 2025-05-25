import { type HttpMetaParams } from "../../../interfaces";
import {
  type Account,
  type GroupedNotificationsResults,
  type NotificationGroupType,
} from "../../entities/v1";
import {
  type NotificationPolicy,
  type NotificationPolicyType,
} from "../../entities/v2";
import { type Paginator } from "../../paginator";
import { type DefaultPaginationParams } from "../../repository";

export interface ListNotificationsParams extends DefaultPaginationParams {
  /** Types to include in the result. */
  readonly types?: readonly NotificationGroupType[] | null;
  /** Types to exclude from the results. */
  readonly excludeTypes?: readonly NotificationGroupType[] | null;
  /** Return only notifications received from the specified account. */
  readonly accountId?: string;

  /**
   * One of full (default) or partial_avatars. When set to partial_avatars,
   * some accounts will not be rendered in full in the returned accounts list but will be
   * instead returned in stripped-down form in the partial_accounts list. The most recent
   * account in a notification group is always rendered in full in the accounts attribute.
   */
  readonly expandAccounts?: "full" | "partial_avatars";

  /**
   * Restrict which notification types can be grouped. Use this if there are notification types
   * for which your client does not support grouping. If omitted, the server will group notifications
   * of all types it supports (currently, favourite, follow and reblog). If you do not want any
   * notification grouping, use GET /api/v1/notifications instead. Notifications that would be
   * grouped if not for this parameter will instead be returned as individual single-notification
   * groups with a unique group_key that can be assumed to be of the form ungrouped-{notification_id}.
   *
   * Please note that neither the streaming API nor the individual notification APIs are aware of this
   * parameter and will always include a “proper” group_key that can be different from what is
   * returned here, meaning that you may have to ignore group_key for such notifications that you do
   * not want grouped and use ungrouped-{notification_id} instead for consistency.
   */
  readonly groupedTypes?: readonly NotificationGroupType[] | null;

  /** Whether to include notifications filtered by the user’s NotificationPolicy. Defaults to false. */
  readonly includeFiltered?: boolean;
}

export interface FetchUnreadCountParams {
  /** Maximum number of results to return. Defaults to 100 notifications. Max 1000 notifications. */
  readonly limit?: number;
  /** Types of notifications that should count towards unread notifications. */
  readonly types?: readonly NotificationGroupType[];
  /** Types of notifications that should not count towards unread notifications. */
  readonly excludeTypes?: readonly NotificationGroupType[];
  /** Only count unread notifications received from the specified account. */
  readonly accountId?: string;
  /** Restrict which notification types can be grouped. Use this if there are notification types for which your client does not support grouping. If omitted, the server will group notifications of all types it supports (currently, favourite, follow and reblog). If you do not want any notification grouping, use GET /api/v1/notifications/unread_count instead. */
  readonly groupedTypes?: readonly NotificationGroupType[];
}

export interface UpdateNotificationPolicyParams {
  /** Whether to accept, filter or drop notifications from accounts the user is not following. drop will prevent creation of the notification object altogether (without preventing the underlying activity), filter will cause it to be marked as filtered, and accept will not affect its processing. */
  readonly forNotFollowing?: NotificationPolicyType;
  /** Whether to accept, filter or drop notifications from accounts that are not following the user. drop will prevent creation of the notification object altogether (without preventing the underlying activity), filter will cause it to be marked as filtered, and accept will not affect its processing. */
  readonly forNotFollowers?: NotificationPolicyType;
  /** Whether to accept, filter or drop notifications from accounts created in the past 30 days. drop will prevent creation of the notification object altogether (without preventing the underlying activity), filter will cause it to be marked as filtered, and accept will not affect its processing. */
  readonly forNewAccounts?: NotificationPolicyType;
  /** Whether to accept, filter or drop notifications from private mentions. drop will prevent creation of the notification object altogether (without preventing the underlying activity), filter will cause it to be marked as filtered, and accept will not affect its processing. Replies to private mentions initiated by the user, as well as accounts the user follows, are always allowed, regardless of this value. */
  readonly forPrivateMentions?: NotificationPolicyType;
  /** Whether to accept, filter or drop notifications from accounts that were limited by a moderator. drop will prevent creation of the notification object altogether (without preventing the underlying activity), filter will cause it to be marked as filtered, and accept will not affect its processing. */
  readonly forLimitedAccounts?: NotificationPolicyType;
}

export interface NotificationRepository {
  /**
   * Return grouped notifications concerning the user. This API returns Link headers containing links
   * to the next/previous page. However, the links can also be constructed dynamically using query
   * params and id values.
   *
   * Notifications of type favourite, follow or reblog with the same type and the same target made in
   * a similar timeframe are given a same group_key by the server, and querying this endpoint will
   * return aggregated notifications, with only one object per group_key. Other notification types may
   * be grouped in the future. The grouped_types parameter should be used by the client to explicitly
   * list the types it supports showing grouped notifications for.
   */
  list(
    params?: ListNotificationsParams,
    meta?: HttpMetaParams,
  ): Paginator<GroupedNotificationsResults>;

  /**
   * @param groupKey The group key of the notification group.
   */
  $select(groupKey: string): {
    /**
     * View information about a specific notification group with a given group key.
     */
    fetch(meta?: HttpMetaParams): Promise<GroupedNotificationsResults>;

    /**
     * Dismiss a single notification group from the server.
     */
    dismiss(meta?: HttpMetaParams): Promise<void>;

    accounts: {
      fetch(meta?: HttpMetaParams): Promise<Account[]>;
    };
  };

  unreadCount: {
    /**
     * Get the (capped) number of unread notification groups for the current user. A notification is
     * considered unread if it is more recent than the notifications read marker. Because the count
     * is dependant on the parameters, it is computed every time and is thus a relatively slow
     * operation (although faster than getting the full corresponding notifications), therefore the
     * number of returned notifications is capped.
     */
    fetch(
      params?: FetchUnreadCountParams,
      meta?: HttpMetaParams,
    ): Promise<{ count: number }>;
  };

  policy: {
    /**
     * Notifications filtering policy for the user.
     */
    fetch(meta?: HttpMetaParams): Promise<NotificationPolicy>;

    /**
     * Update the user’s notifications filtering policy.
     */
    update(
      params: UpdateNotificationPolicyParams,
      meta?: HttpMetaParams<"json">,
    ): Promise<NotificationPolicy>;
  };
}
