import { type HttpMetaParams } from "../../../interfaces";
import { type MediaAttachment } from "../../entities/v1";

export interface CreateMediaAttachmentParams {
  /** The file to be attached, using multipart form data. */
  readonly file: Blob | string;
  /** A plain-text description of the media, for accessibility purposes. */
  readonly description?: string | null;
  /** Two floating points (x,y), comma-delimited, ranging from -1.0 to 1.0 */
  readonly focus?: string | null;
  /** Custom thumbnail */
  readonly thumbnail?: Blob | string | null;
}

export type UpdateMediaAttachmentParams = Partial<CreateMediaAttachmentParams>;

export interface MediaAttachmentRepository {
  /**
   * Creates an attachment to be used with a new status.
   * @param params Parameters
   * @return Attachment
   * @see https://docs.joinmastodon.org/methods/statuses/media/
   */
  create(
    params: CreateMediaAttachmentParams,
    meta?: HttpMetaParams<"json">,
  ): Promise<MediaAttachment>;

  $select(id: string): {
    /**
     * Fetches an attachment to be used with a new status.
     * @param id ID of the attachment
     * @see https://github.com/tootsuite/mastodon/pull/13210
     */
    fetch(meta?: HttpMetaParams): Promise<MediaAttachment>;

    /**
     * Update an Attachment, before it is attached to a status and posted.
     * @param id The id of the Attachment entity to be updated
     * @param params Parameters
     * @return Attachment
     * @see https://docs.joinmastodon.org/methods/statuses/media/
     */
    update(
      params: UpdateMediaAttachmentParams,
      meta?: HttpMetaParams<"json">,
    ): Promise<MediaAttachment>;
  };
}
