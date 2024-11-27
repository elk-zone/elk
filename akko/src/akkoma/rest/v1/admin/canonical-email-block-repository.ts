import { type HttpMetaParams } from "../../../../interfaces";
import { type Admin } from "../../../entities/v1";
import { type Paginator } from "../../../paginator";
import { type DefaultPaginationParams } from "../../../repository";

export interface TestCanonicalEmailBlockParams {
  /** The email to canonicalize and hash */
  readonly email: string;
}

export interface CreateCanonicalEmailBlockParamsWithEmail {
  /** The email to canonicalize, hash, and block. If this parameter is provided, canonical_email_hash will be ignored. */
  readonly email: string;
}

export interface CreateCanonicalEmailBlockParamsWithCanonicalEmailHash {
  /** The hash to test against. If email is not provided, this parameter is required. */
  readonly canonicalEmailHash: string;
}

export type CreateCanonicalEmailBlockParams =
  | CreateCanonicalEmailBlockParamsWithEmail
  | CreateCanonicalEmailBlockParamsWithCanonicalEmailHash;

export interface CanonicalEmailBlockRepository {
  /**
   * List all canonical email blocks.
   * @param params Parameters
   * @return Array of CanonicalEmailBlock
   * @see https://docs.joinmastodon.org/methods/admin/canonical_email_blocks/
   */
  list(
    params?: DefaultPaginationParams,
    meta?: HttpMetaParams,
  ): Paginator<Admin.CanonicalEmailBlock[], DefaultPaginationParams>;

  /**
   * Canonicalize and hash an email address.
   * @param params Parameters
   * @return Array of CanonicalEmailBlock
   * @see https://docs.joinmastodon.org/methods/admin/canonical_email_blocks/#test
   */
  test(
    params: TestCanonicalEmailBlockParams,
    meta?: HttpMetaParams<"json">,
  ): Promise<Admin.CanonicalEmailBlock[]>;

  /**
   * Block a canonical email.
   * @param params Parameters
   * @return CanonicalEmailBlock
   * @see https://docs.joinmastodon.org/methods/admin/canonical_email_blocks
   */
  create(
    params: CreateCanonicalEmailBlockParams,
    meta?: HttpMetaParams<"json">,
  ): Promise<Admin.CanonicalEmailBlock>;

  $select(id: string): {
    /**
     * Show a single canonical email block
     * @return CanonicalEmailBlock
     * @see https://docs.joinmastodon.org/methods/admin/canonical_email_blocks
     */
    fetch(meta?: HttpMetaParams): Promise<Admin.CanonicalEmailBlock>;

    /**
     * Lift a block a canonical email.
     * @return null
     * @see https://docs.joinmastodon.org/methods/admin/canonical_email_blocks
     */
    remove(meta?: HttpMetaParams): Promise<void>;
  };
}
