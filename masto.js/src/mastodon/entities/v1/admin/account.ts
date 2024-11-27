import { type Account as PublicAccount } from "../../v1/account";
import { type Role } from "../role";
import { type Ip } from "./ip";

/**
 * Admin-level information about a given account.
 * @see https://docs.joinmastodon.org/entities/admin-account/
 */
export interface Account {
  /** The ID of the account in the database. */
  id: string;
  /** The username of the account. */
  username: string;
  /** The domain of the account. */
  domain?: string | null;
  /** When the account was first discovered. */
  createdAt: string;
  /** The email address associated with the account. */
  email: string;
  /** The IP address last used to login to this account. */
  ip?: string | null;
  /** All known IP addresses associated with this account. */
  ips: Ip[];
  /** The locale of the account. */
  locale: string;
  /** The reason given when requesting an invite (for instances that require manual approval of registrations) */
  inviteRequest?: string | null;
  /** The current role of the account. */
  role: Role;
  /** Whether the account has confirmed their email address. */
  confirmed: boolean;
  /** Whether the account is currently approved. */
  approved: boolean;
  /** Whether the account is currently disabled. */
  disabled: boolean;
  /** Whether the account is currently silenced. */
  silenced: boolean;
  /** Whether the account is currently suspended. */
  suspended: boolean;
  /** Boolean. Filter for accounts force-marked as sensitive? */
  sensitized: boolean;
  /** User-level information about the account. */
  account: PublicAccount;
  /** The ID of the application that created this account. */
  createdByApplicationId?: string | null;
  /** The ID of the account that invited this user */
  invitedByAccountId?: string | null;
}
