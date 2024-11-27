import { type HttpMetaParams } from "../../../../interfaces";
import { type Admin, type Status, type TrendLink } from "../../../entities/v1";
import { type Paginator } from "../../../paginator";

export interface TrendRepository {
  links: {
    /**
     * Links that have been shared more than others, including unapproved and unreviewed links.
     * @see https://docs.joinmastodon.org/methods/admin/trends/#links
     */
    list(meta?: HttpMetaParams): Paginator<TrendLink[]>;

    /** https://github.com/mastodon/mastodon/pull/24257 */
    $select(id: string): {
      approve(meta?: HttpMetaParams): Promise<TrendLink>;
      reject(meta?: HttpMetaParams): Promise<TrendLink>;
    };

    /** https://github.com/mastodon/mastodon/pull/24257 */
    publishers: {
      list(meta?: HttpMetaParams): Paginator<TrendLink[]>;
      $select(id: string): {
        approve(meta?: HttpMetaParams): Promise<TrendLink>;
        reject(meta?: HttpMetaParams): Promise<TrendLink>;
      };
    };
  };

  statuses: {
    /**
     * Statuses that have been interacted with more than others, including unapproved and unreviewed statuses.
     * @see https://docs.joinmastodon.org/methods/admin/trends/#statuses
     */
    list(meta?: HttpMetaParams): Paginator<Status[]>;

    /** https://github.com/mastodon/mastodon/pull/24257 */
    $select(id: string): {
      approve(meta?: HttpMetaParams): Promise<Status>;
      reject(meta?: HttpMetaParams): Promise<Status>;
    };
  };

  tags: {
    /**
     * Tags that are being used more frequently within the past week, including unapproved and unreviewed tags.
     * @see https://docs.joinmastodon.org/methods/admin/trends/#tags
     */
    list(meta?: HttpMetaParams): Paginator<Admin.Tag[]>;

    /** https://github.com/mastodon/mastodon/pull/24257 */
    $select(id: string): {
      approve(meta?: HttpMetaParams): Promise<Admin.Tag>;
      reject(meta?: HttpMetaParams): Promise<Admin.Tag>;
    };
  };
}
