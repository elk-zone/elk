import { type HttpMetaParams } from "../../../../interfaces";
import { type Admin } from "../../../entities/v1";
import { type Paginator } from "../../../paginator";

export interface CreateDomainBlockParams {
  /** The domain to block federation required*/
  readonly domain: string;
  /** Whether to apply a silence, suspend, or noop to the domain?*/
  readonly severity?: Admin.DomainBlockSeverity;
  /** Whether media attachments should be rejected*/
  readonly rejectMedia?: boolean;
  /** Whether reports from this domain should be rejected*/
  readonly rejectReports?: boolean;
  /**  A private note about this domain block, visible only to admins*/
  readonly privateComment?: string | null;
  /** A public note about this domain block, optionally shown on the about page*/
  readonly publicComment?: string | null;
  /** Whether to partially censor the domain when shown in public*/
  readonly obfuscate?: boolean;
}

export interface ListDomainBlocksParams {
  readonly limit?: number;
}

export type UpdateDomainBlockParams = Omit<CreateDomainBlockParams, "domain">;

export interface DomainBlockRepository {
  /**
   * Show information about all blocked domains
   * @param params Parameters
   * @return Array of DomainBlock
   * @see https://docs.joinmastodon.org/methods/admin/domain_blocks/#get
   */
  list(
    params?: ListDomainBlocksParams,
    meta?: HttpMetaParams,
  ): Paginator<Admin.DomainBlock[], ListDomainBlocksParams>;

  /**
   * Add a domain to the list of domains blocked from federating.
   * @param params Parameters
   * @return DomainBlock
   * @see https://docs.joinmastodon.org/methods/admin/domain_blocks/#post
   */
  create(
    params: CreateDomainBlockParams,
    meta?: HttpMetaParams<"json">,
  ): Promise<Admin.DomainBlock>;

  $select(id: string): {
    /**
     * Show information about a single blocked domain.
     * @return DomainBlock
     * @see https://docs.joinmastodon.org/methods/admin/domain_blocks/#get-one
     */
    fetch(meta?: HttpMetaParams): Promise<Admin.DomainBlock>;

    /**
     * Change parameters for an existing domain block.
     * @param params Parameters
     * @return DomainBlock
     * @see https://docs.joinmastodon.org/methods/admin/domain_blocks/#update
     */
    update(
      params?: UpdateDomainBlockParams,
      meta?: HttpMetaParams<"json">,
    ): Promise<Admin.DomainBlock>;

    /**
     * Lift a block against a domain.
     * @return DomainBlock
     * @see https://docs.joinmastodon.org/methods/admin/domain_blocks/#delete
     */
    remove(meta?: HttpMetaParams): Promise<void>;
  };
}
