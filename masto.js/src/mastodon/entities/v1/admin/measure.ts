export interface MeasureData {
  /** Midnight on the requested day in the time period. */
  date: string;
  /** The numeric value for the requested measure. */
  value: string;
}

/** @see https://docs.joinmastodon.org/entities/Admin_Measure/#key */
export type MeasureKey =
  | "active_users"
  | "new_users"
  | "interactions"
  | "opened_reports"
  | "resolved_reports"
  | "tag_accounts"
  | "tag_uses"
  | "tag_servers"
  | "instance_accounts"
  | "instance_media_attachments"
  | "instance_reports"
  | "instance_statuses"
  | "instance_follows"
  | "instance_followers";

/**
 * Represents quantitative data about the server.
 * @see https://docs.joinmastodon.org/entities/Admin_Measure
 */
export interface Measure {
  /** The unique keystring for the requested measure. */
  key: MeasureKey;
  /** The units associated with this data item’s value, if applicable. */
  unit?: string | null;
  /** The numeric total associated with the requested measure. */
  total: string;
  /** A human-readable formatted value for this data item. */
  humanValue?: string;
  /** The numeric total associated with the requested measure, in the previous period. Previous period is calculated by subtracting the start_at and end_at dates, then offsetting both start and end dates backwards by the length of the time period. */
  previousTotal?: string;
  /** The data available for the requested measure, split into daily buckets. */
  data: MeasureData[];
}
