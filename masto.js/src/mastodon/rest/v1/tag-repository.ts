import { type HttpMetaParams } from "../../../interfaces";
import { type Tag } from "../../entities/v1";

export interface TagRepository {
  $select(id: string): {
    /**
     * Show a hashtag and its associated information
     * @return Tag
     */
    fetch(meta?: HttpMetaParams): Promise<Tag>;

    /**
     * Follow a hashtag. Posts containing a followed hashtag will be inserted into your home timeline.
     * @return Tag
     */
    follow(meta?: HttpMetaParams): Promise<Tag>;

    /**
     * Unfollow a hashtag. Posts containing a followed hashtag will no longer be inserted into your home timeline.
     * @return Tag
     */
    unfollow(meta?: HttpMetaParams): Promise<Tag>;
  };
}
