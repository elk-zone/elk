/**
 * Represents an OAuth token used for authenticating with the API and performing actions.
 * @see https://docs.joinmastodon.org/entities/token/
 */
export interface Token {
  /** An OAuth token to be used for authorization. */
  accessToken: string;
  /** The OAuth token type. Mastodon uses Bearer tokens. */
  tokenType: string;
  /** The OAuth scopes granted by this token, space-separated. */
  scope: string;
  /** When the token was generated. */
  createdAt: number;
}
