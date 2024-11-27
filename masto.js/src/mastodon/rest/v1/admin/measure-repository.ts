import { type HttpMetaParams } from "../../../../interfaces";
import { type Admin } from "../../../entities/v1";
import { type MeasureKey } from "../../../entities/v1/admin";

export interface FetchMeasureParams {
  /**
   * Array of String. Request specific measures by their keystring. Supported measures include:
   *
   * `active_users` = Total active users on your instance within the time period
   *
   * `new_users` = Users who joined your instance within the time period
   *
   * `interactions` = Total interactions (favourites, boosts, replies) on local statuses within the time period
   *
   * `opened_reports` = Total reports filed within the time period
   *
   * `resolved_reports` = Total reports resolved within the time period
   *
   * `tag_accounts` = Total accounts who used a tag in at least one status within the time period
   *
   * `tag_uses` = Total statuses which used a tag within the time period
   *
   * `tag_servers` = Total remote origin servers for statuses which used a tag within the time period
   *
   * `instance_accounts` = Total accounts originating from a remote domain within the time period
   *
   * `instance_media_attachments` = Total space used by media attachments from a remote domain within the time period
   *
   * `instance_reports` = Total reports filed against accounts from a remote domain within the time period
   *
   * `instance_statuses` = Total statuses originating from a remote domain within the time period
   *
   * `instance_follows` = Total accounts from a remote domain followed by a local user within the time period
   *
   * `instance_followers` = Total local accounts followed by accounts from a remote domain within the time period
   */
  readonly keys: readonly MeasureKey[];
  /** String (ISO 8601 Datetime). The start date for the time period. If a time is provided, it will be ignored. */
  readonly startAt: string;
  /** String (ISO 8601 Datetime). The end date for the time period. If a time is provided, it will be ignored. */
  readonly endAt: string;
  readonly tagAccounts?: {
    /** String. When `tag_accounts` is one of the requested keys, you must provide a tag ID to obtain the measure of how many accounts used that hashtag in at least one status within the given time period. */
    readonly id?: string | null;
  } | null;
  readonly tagUses?: {
    /** String. When `tag_uses` is one of the requested keys, you must provide a tag ID to obtain the measure of how many statuses used that hashtag within the given time period. */
    readonly id?: string | null;
  } | null;
  readonly tagServers?: {
    /** String. When `tag_servers` is one of the requested keys, you must provide a tag ID to obtain the measure of how many servers used that hashtag in at least one status within the given time period. */
    readonly id?: string | null;
  } | null;
  readonly instanceAccounts?: {
    /** String. When `instance_accounts` is one of the requested keys, you must provide a remote domain to obtain the measure of how many accounts have been discovered from that server within the given time period. */
    readonly domain?: string | null;
  } | null;
  readonly instanceMediaAttachments?: {
    /** String. When `instance_media_attachments` is one of the requested keys, you must provide a remote domain to obtain the measure of how much space is used by media attachments from that server within the given time period. */
    readonly domain?: string | null;
  } | null;
  readonly instanceReports?: {
    /** String. When `instance_reports` is one of the requested keys, you must provide a remote domain to obtain the measure of how many reports have been filed against accounts from that server within the given time period. */
    readonly domain?: string | null;
  } | null;
  readonly instanceStatuses?: {
    /** String. When `instance_statuses` is one of the requested keys, you must provide a remote domain to obtain the measure of how many statuses originate from that server within the given time period. */
    readonly domain?: string | null;
  } | null;
  readonly instanceFollows?: {
    /** String. When `instance_follows` is one of the requested keys, you must provide a remote domain to obtain the measure of how many follows were performed on accounts from that server by local accounts within the given time period */
    readonly domain?: string | null;
  } | null;
  readonly instanceFollowers?: {
    /** String. When `instance_followers` is one of the requested keys, you must provide a remote domain to obtain the measure of how many follows were performed by accounts from that server on local accounts within the given time period. */
    readonly domain?: string | null;
  } | null;
}

export interface MeasureRepository {
  /**
   * Obtain quantitative metrics about the server.
   * @see https://docs.joinmastodon.org/methods/admin/measures/#get
   */
  create(
    params: FetchMeasureParams,
    meta?: HttpMetaParams<"json">,
  ): Promise<Admin.Measure[]>;
}
