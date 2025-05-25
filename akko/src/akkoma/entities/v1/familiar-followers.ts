import { type Account } from "./account";

/**
 * Represents a subset of your follows who also follow some other user.
 * @see https://docs.joinmastodon.org/entities/FamiliarFollowers/
 */
export interface FamiliarFollowers {
  /** The ID of the Account in the database. */
  id: string;
  /** Accounts you follow that also follow this account. */
  accounts: Account[];
}
