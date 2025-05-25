import { type HttpMetaParams } from "../../interfaces";
import { type Token } from "../entities/v1";

/**
 * @deprecated Use `CreateTokenParamsWithPassword` instead
 */
export type CreateTokenParamsWithPassword = CreateTokenWithPasswordParams;

interface BaseCreateTokenParams<T extends string> {
  /** Set equal to `authorization_code` if code is provided in order to gain user-level access. Otherwise, set equal to `client_credentials` to obtain app-level access only. */
  readonly grantType: T;
  /** The client ID, obtained during app registration. */
  readonly clientId: string;
  /** The client secret, obtained during app registration. */
  readonly clientSecret: string;
  /** Set a URI to redirect the user to. If this parameter is set to urn:ietf:wg:oauth:2.0:oob then the token will be shown instead. Must match one of the `redirect_uris` declared during app registration. */
  readonly redirectUri: string;
  /** List of requested OAuth scopes, separated by spaces (or by pluses, if using query parameters). If code was provided, then this must be equal to the `scope` requested from the user. Otherwise, it must be a subset of `scopes` declared during app registration. If not provided, defaults to read. */
  readonly scope?: string | null;
}

export interface CreateTokenWithAuthorizationCodeParams
  extends BaseCreateTokenParams<"authorization_code"> {
  /** A user authorization code, obtained via GET /oauth/authorize. */
  readonly code: string;
}

export type CreateTokenWithClientCredentialsParams =
  BaseCreateTokenParams<"client_credentials">;

export interface CreateTokenWithPasswordParams
  extends BaseCreateTokenParams<"password"> {
  readonly password: string;
  readonly username: string;
}

export type CreateTokenParams =
  | CreateTokenWithClientCredentialsParams
  | CreateTokenWithPasswordParams
  | CreateTokenWithAuthorizationCodeParams;

export interface TokenRepository {
  create(
    params: CreateTokenParams,
    meta?: HttpMetaParams<"multipart-form">,
  ): Promise<Token>;
}
