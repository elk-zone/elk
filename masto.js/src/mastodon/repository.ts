export interface DefaultPaginationParams {
  /** Return results older than this ID. */
  readonly maxId?: string | null;
  /** Return results newer than this ID. */
  readonly sinceId?: string | null;
  /** Get a list of items with ID greater than this value excluding this ID */
  readonly minId?: string | null;
  /** Maximum number of results to return per page. Defaults to 40. NOTE: Pagination is done with the Link header from the response. */
  readonly limit?: number | null;
}
