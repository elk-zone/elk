import { type HttpMetaParams } from "../../../interfaces";
import { type Account } from "../../entities/v1";
import { type Paginator } from "../../paginator";
import { type DefaultPaginationParams } from "../../repository";

export interface EndorsementRepository {
  /**
   * Accounts that the user is currently featuring on their profile.
   * @return Array of Account
   * @see https://docs.joinmastodon.org/methods/accounts/endorsements/
   */
  list(
    params?: DefaultPaginationParams,
    meta?: HttpMetaParams,
  ): Paginator<Account[], DefaultPaginationParams>;
}
