import { type HttpMetaParams } from "../../../interfaces";
import {
  type Notification,
  type NotificationRequest,
  type NotificationType,
} from "../../entities/v1";
import { type Paginator } from "../../paginator";
import { type DefaultPaginationParams } from "../../repository";

export interface ListNotificationsParams extends DefaultPaginationParams {
  /** Instead of specifying every known type to exclude, you can specify only the types you want. */
  readonly types?: readonly NotificationType[] | null;
  /** ID of the account */
  readonly accountId?: string | null;
  /** Array of notifications to exclude (Allowed values: "follow", "favourite", "reblog", "mention") */
  readonly excludeTypes?: readonly NotificationType[] | null;
}

export interface FetchUnreadCountParams {
  /** Maximum number of results to return. Defaults to 100 notifications. Max 1000 notifications. */
  limit?: number | null;
  /** Types of notifications that should count towards unread notifications. */
  types?: readonly NotificationType[] | null;
  /** Types of notifications that should not count towards unread notifications. */
  excludeTypes?: readonly NotificationType[] | null;
  /** Only count unread notifications received from the specified account. */
  accountId?: string | null;
}

export interface NotificationRepository {
  /**
   * Notifications concerning the user.
   * This API returns Link headers containing links to the next/previous page.
   * However, the links can also be constructed dynamically using query params and `id` values.
   * @param params Query parameter
   * @return Array of Notification
   * @see https://docs.joinmastodon.org/methods/notifications/
   */
  list(
    params?: ListNotificationsParams,
    meta?: HttpMetaParams<"json">,
  ): Paginator<Notification[], ListNotificationsParams>;

  /**
   * Notifications concerning the user.
   * This API returns Link headers containing links to the next/previous page.
   * However, the links can also be constructed dynamically using query params and `id` values.
   * @param params Query parameter
   * @return Array of Notification
   * @see https://docs.joinmastodon.org/methods/notifications/
   */
  fetch(
    params?: ListNotificationsParams,
    meta?: HttpMetaParams,
  ): Promise<Notification[]>;

  $select(id: string): {
    /**
     * View information about a notification with a given ID.
     * @return Notification
     * @see https://docs.joinmastodon.org/methods/notifications/
     */
    fetch(meta?: HttpMetaParams): Promise<Notification>;

    /**
     * Clear a single notification from the server.
     * @return N/A
     * @see https://docs.joinmastodon.org/methods/notifications/
     */
    dismiss(meta?: HttpMetaParams): Promise<void>;
  };

  /**
   * Clear all notifications from the server.
   * @return N/A
   * @see https://docs.joinmastodon.org/methods/notifications/
   */
  clear(meta?: HttpMetaParams): Promise<void>;

  requests: {
    /**
     * Notification requests for notifications filtered by the user’s policy. This API returns Link headers containing links to the next/previous page.
     */
    list(
      params?: DefaultPaginationParams,
      meta?: HttpMetaParams<"json">,
    ): Paginator<NotificationRequest[], DefaultPaginationParams>;

    $select(id: string): {
      /**
       * View information about a notification request with a given ID.
       */
      fetch(meta?: HttpMetaParams): Promise<NotificationRequest>;

      /**
       * Accept a notification request, which merges the filtered notifications from that user back into the main notification and accepts any future notification from them.
       */
      accept(meta?: HttpMetaParams): Promise<void>;

      /**
       * Dismiss a notification request, which hides it and prevent it from contributing to the pending notification requests count.
       */
      dismiss(meta?: HttpMetaParams): Promise<void>;
    };

    /**
     * Accepts multiple notification requests, which merges the filtered notifications from those users back into the main notifications and accepts any future notification from them.
     */
    accept(meta?: HttpMetaParams): Promise<void>;

    /**
     * Dismiss multiple notification requests, which hides them and prevent them from contributing to the pending notification requests count.
     */
    dismiss(meta?: HttpMetaParams): Promise<void>;

    merged: {
      /**
       * Check whether accepted notification requests have been merged. Accepting notification requests schedules a background job to merge the filtered notifications back into the normal notification list. When that process has finished, the client should refresh the notifications list at its earliest convenience. This is communicated by the notifications_merged streaming event but can also be polled using this endpoint.
       */
      fetch(meta?: HttpMetaParams): Promise<{ merged: boolean }>;
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
}
