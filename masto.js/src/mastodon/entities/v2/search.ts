import { type Account, type Status, type Tag } from "../v1";

/**
 * Represents the results of a search.
 * @see https://docs.joinmastodon.org/entities/Search/
 */
export interface Search {
  /** Accounts which match the given query */
  accounts: Account[];
  /** Statuses which match the given query */
  statuses: Status[];
  /** Hashtags which match the given query */
  hashtags: Tag[];
}
