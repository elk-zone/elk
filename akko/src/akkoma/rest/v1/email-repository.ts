import { type HttpMetaParams } from "../../../interfaces";

export interface CreateConfirmationParams {
  /** If provided, updates the unconfirmed user’s email before resending the confirmation email. */
  readonly email?: string;
}

export interface EmailRepository {
  confirmations: {
    /**
     * Resend confirmation email
     * @param params Form data parameters
     * @returns Empty object
     * @see https://docs.joinmastodon.org/methods/emails/#confirmation
     */
    create(
      params: CreateConfirmationParams,
      meta?: HttpMetaParams<"multipart-form">,
    ): Promise<void>;
  };
}
