import { type HttpMetaParams } from "../../../interfaces";
import {
  type Activity,
  type DomainBlock,
  type ExtendedDescription,
  type Instance,
} from "../../entities/v1";
import { type Paginator } from "../../paginator";

export interface InstanceRepository {
  /**
   * Information about the server.
   * @return Instance
   * @see https://docs.joinmastodon.org/methods/instance/
   */
  fetch(meta?: HttpMetaParams): Promise<Instance>;

  peers: {
    /**
     * Domains that this instance is aware of.
     * @return Array of Activity
     * @see https://docs.joinmastodon.org/methods/instance/
     */
    list(meta?: HttpMetaParams): Paginator<string[]>;
  };

  activity: {
    /**
     * Instance activity over the last 3 months, binned weekly.
     * @return Array of Activity
     * @see https://docs.joinmastodon.org/methods/instance/#activity
     */
    list(meta?: HttpMetaParams): Paginator<Activity[]>;
  };

  languages: {
    /** https://github.com/mastodon/mastodon/pull/24443 */
    list(meta?: HttpMetaParams): Promise<string[]>;
  };

  extendedDescription: {
    /**
     * Obtain an extended description of this server
     */
    fetch(meta?: HttpMetaParams): Promise<ExtendedDescription>;
  };

  translationLanguages: {
    /** https://github.com/mastodon/mastodon/pull/24037 */
    list(meta?: HttpMetaParams): Promise<Record<string, string[]>>;
  };

  domainBlocks: {
    /**
     * Obtain a list of domains that have been blocked.
     * @see https://docs.joinmastodon.org/methods/instance/#domain_blocks
     */
    fetch(meta?: HttpMetaParams): Promise<DomainBlock[]>;
  };
}
