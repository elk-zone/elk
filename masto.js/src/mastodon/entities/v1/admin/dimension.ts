export interface DimensionData {
  /** The unique keystring for this data item. */
  key: string;
  /** A human-readable key for this data item. */
  humanKey: string;
  /** The value for this data item. */
  value: string;
  /** The units associated with this data item’s value, if applicable. */
  unit?: string | null;
  /** A human-readable formatted value for this data item. */
  humanValue?: string | null;
}

export type DimensionKey =
  | "languages"
  | "sources"
  | "servers"
  | "space_usage"
  | "software_versions"
  | "tag_servers"
  | "tag_languages"
  | "instance_accounts"
  | "instance_languages";

/**
 * Represents qualitative data about the server.
 * @see https://docs.joinmastodon.org/entities/Admin_Dimension/
 */
export interface Dimension {
  /** The unique keystring for the requested dimension. */
  key: DimensionKey;
  /** The data available for the requested dimension. */
  data: DimensionData[];
}
