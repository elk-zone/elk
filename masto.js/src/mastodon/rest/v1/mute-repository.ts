import { type HttpMetaParams } from "../../../interfaces";
import { type Account } from "../../entities/v1";
import { type Paginator } from "../../paginator";
import { type DefaultPaginationParams } from "../../repository";

export interface MuteRepository {
  /**
   * Accounts the user has muted.
   * @param params Parameters
   * @return Array of Account
   * @see https://docs.joinmastodon.org/methods/accounts/mutes/
   */
  list(
    params?: DefaultPaginationParams,
    meta?: HttpMetaParams<"json">,
  ): Paginator<Account[], DefaultPaginationParams>;
}
