import { type HttpMetaParams } from "../../interfaces";
import { type TokenRepository } from "./token-repository";

export interface RevokeTokenParams {
  /** The client ID, obtained during app registration. */
  readonly clientId: string;
  /** The client secret, obtained during app registration. */
  readonly clientSecret: string;
  /** The previously obtained token, to be invalidated. */
  readonly token: string;
}

export interface Client {
  readonly token: TokenRepository;

  /**
   * Revoke an access token to make it no longer valid for use.
   * @param params Form data parameters
   * @param meta HTTP metadata
   * @see https://docs.joinmastodon.org/methods/oauth/#revoke
   */
  revoke(
    params: RevokeTokenParams,
    meta?: HttpMetaParams<"multipart-form">,
  ): Promise<void>;
}
