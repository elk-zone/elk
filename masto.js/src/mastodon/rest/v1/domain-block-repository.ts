import { type HttpMetaParams } from "../../../interfaces";
import { type Paginator } from "../../paginator";
import { type DefaultPaginationParams } from "../../repository";

export interface CreateDomainBlockParams {
  /** Domain to block */
  readonly domain: string;
}

export interface RemoveDomainBlockParams {
  /** Domain to unblock */
  readonly domain: string;
}

export interface DomainBlockRepository {
  /**
   * View domains the user has blocked.
   * @param params Parameters
   * @return Array of strings
   * @see https://docs.joinmastodon.org/methods/accounts/domain_blocks/
   */
  list(
    params?: DefaultPaginationParams,
    meta?: HttpMetaParams,
  ): Paginator<string[], DefaultPaginationParams>;

  /**
   * Block a domain to:
   * - hide all public posts from it
   * - hide all notifications from it
   * - remove all followers from it
   * - prevent following new users from it (but does not remove existing follows)
   * @param domain Domain to block.
   * @return N/A
   * @see https://docs.joinmastodon.org/methods/accounts/domain_blocks/
   */
  create(
    params: CreateDomainBlockParams,
    meta?: HttpMetaParams<"json">,
  ): Promise<void>;

  /**
   * Remove a domain block, if it exists in the user's array of blocked domains.
   * @param domain Domain to unblock
   * @return N/A
   * @see https://docs.joinmastodon.org/methods/accounts/domain_blocks/
   */
  remove(
    params: RemoveDomainBlockParams,
    meta?: HttpMetaParams<"json">,
  ): Promise<void>;
}
