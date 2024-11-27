import {
  type Announcement,
  type Conversation,
  type Notification,
  type Reaction,
  type Status,
} from "../entities/v1";

export interface RawEventOk {
  stream: string[];
  event: string;
  payload?: string;
}

export interface RawEventError {
  error: string;
}

export type RawEvent = RawEventOk | RawEventError;

interface BaseEvent<T, U> {
  stream: string[];
  event: T;
  payload: U;
}

export type UpdateEvent = BaseEvent<"update", Status>;

export type DeleteEvent = BaseEvent<"delete", string>;

export type NotificationEvent = BaseEvent<"notification", Notification>;

export type FiltersChangedEvent = BaseEvent<"filters_changed", undefined>;

export type ConversationEvent = BaseEvent<"conversation", Conversation>;

export type AnnouncementEvent = BaseEvent<"announcement", Announcement>;

export type AnnouncementReactionEvent = BaseEvent<
  "announcement.reaction",
  Reaction
>;

export type AnnouncementDeleteEvent = BaseEvent<"announcement.delete", string>;

export type StatusUpdateEvent = BaseEvent<"status.update", Status>;

/** Accepted notification requests have finished merging, and the notifications list should be refreshed. Payload can be ignored. Available since v4.3.0 */
export type NotificationsMergedEvent = BaseEvent<
  "notifications_merged",
  undefined
>;

export type Event =
  | UpdateEvent
  | DeleteEvent
  | NotificationEvent
  | FiltersChangedEvent
  | ConversationEvent
  | AnnouncementEvent
  | AnnouncementReactionEvent
  | AnnouncementDeleteEvent
  | StatusUpdateEvent
  | NotificationsMergedEvent;
