import { type HttpMetaParams } from "../../../interfaces";
import { type CustomEmoji } from "../../entities/v1";
import { type Paginator } from "../../paginator";

export interface CustomEmojiRepository {
  /**
   * Returns custom emojis that are available on the server.
   * @return Array of CustomEmoji
   * @see https://docs.joinmastodon.org/methods/instance/custom_emojis/
   */
  list(meta?: HttpMetaParams): Paginator<CustomEmoji[]>;
}
