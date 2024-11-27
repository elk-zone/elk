import { type HttpMetaParams } from "../../../interfaces";

export interface ProfileRepository {
  avatar: {
    /**https://github.com/mastodon/mastodon/pull/25124 */
    remove(meta?: HttpMetaParams): Promise<void>;
  };

  header: {
    /**https://github.com/mastodon/mastodon/pull/25124 */
    remove(meta?: HttpMetaParams): Promise<void>;
  };
}
