import { type HttpMetaParams } from "../../../../interfaces";
import { type Admin } from "../../../entities/v1";
import { type IpBlockSeverity } from "../../../entities/v1/admin";
import { type Paginator } from "../../../paginator";

export interface ListIpBlocksParams {
  /** Integer. Maximum number of results to return. Defaults to 100. */
  readonly limit?: number | null;
}

export interface CreateIpBlockParams {
  /** The IP address and prefix to block. */
  readonly ip?: string | null;
  /** The policy to apply to this IP range. */
  readonly severity: IpBlockSeverity;
  /** The reason for this IP block. */
  readonly comment?: string | null;
  /** The number of seconds in which this IP block will expire. */
  readonly expiresIn?: number | null;
}

export interface UpdateIpBlockParams {
  /** The IP address and prefix to block. */
  readonly ip?: string | null;
  /** The policy to apply to this IP range. */
  readonly severity?: IpBlockSeverity | null;
  /** The reason for this IP block. */
  readonly comment?: string | null;
  /** The number of seconds in which this IP block will expire. */
  readonly expiresIn?: number | null;
}

export interface IpBlockRepository {
  /**
   * Show information about all blocked IP ranges.
   * @param params Parameters
   * @return Array of IpBlock
   * @see https://docs.joinmastodon.org/methods/admin/ip_blocks/#get
   */
  list(
    params?: ListIpBlocksParams,
    meta?: HttpMetaParams,
  ): Paginator<Admin.IpBlock[], ListIpBlocksParams>;

  $select(id: string): {
    /**
     * Show information about a single IP block.
     * @return IpBlock
     * @see https://docs.joinmastodon.org/methods/admin/ip_blocks/#get-one
     */
    fetch(meta?: HttpMetaParams): Promise<Admin.IpBlock>;

    /**
     * Change parameters for an existing IP block.
     * @param params Parameters
     * @return IpBlock
     * @see https://docs.joinmastodon.org/methods/admin/ip_blocks/#update
     */
    update(
      params: UpdateIpBlockParams,
      meta?: HttpMetaParams<"json">,
    ): Promise<Admin.IpBlock>;

    /**
     * Lift a block against an IP range.
     * @return null
     * @see https://docs.joinmastodon.org/methods/admin/ip_blocks/#delete
     */
    remove(meta?: HttpMetaParams): Promise<void>;
  };

  /**
   * Add an IP address range to the list of IP blocks.
   * @param params Parameters
   * @return IpBlock
   * @see https://docs.joinmastodon.org/methods/admin/ip_blocks/#post
   */
  create(
    params: CreateIpBlockParams,
    meta?: HttpMetaParams<"json">,
  ): Promise<Admin.IpBlock>;
}
