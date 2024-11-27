import { CustomError } from "ts-custom-error";

export class MastoWebSocketError extends CustomError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.message = message;
  }
}
