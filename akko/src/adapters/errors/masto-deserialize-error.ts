import { CustomError } from "ts-custom-error";

export class MastoDeserializeError extends CustomError {
  readonly contentType: string;
  readonly data: unknown;

  constructor(
    message: string,
    contentType: string,
    data: unknown,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.contentType = contentType;
    this.data = data;
  }
}
