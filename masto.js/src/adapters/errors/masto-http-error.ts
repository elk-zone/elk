import { CustomError } from "ts-custom-error";

// https://github.com/tootsuite/mastodon/pull/15803
export type MastoErrorType =
  | "ERR_BLOCKED"
  | "ERR_UNREACHABLE"
  | "ERR_TAKEN"
  | "ERR_RESERVED"
  | "ERR_ACCEPTED"
  | "ERR_BLANK"
  | "ERR_INVALID"
  | "ERR_TOO_LONG"
  | "ERR_TOO_SHORT"
  | "ERR_INCLUSION";

export interface MastoHttpErrorDetail {
  readonly error: MastoErrorType;
  readonly description: string;
}

export type MastoHttpErrorDetails = Record<
  string,
  readonly MastoHttpErrorDetail[]
>;

export interface MastoHttpErrorProps {
  readonly statusCode: number;
  readonly message: string;
  readonly description?: string;
  readonly details?: MastoHttpErrorDetails;
  readonly additionalProperties?: Record<string, unknown>;
}

export class MastoHttpError extends CustomError {
  readonly statusCode: number;
  readonly description?: string;
  readonly details?: MastoHttpErrorDetails;
  readonly additionalProperties?: Record<string, unknown>;

  constructor(props: MastoHttpErrorProps, errorOptions?: ErrorOptions) {
    super(props.message, errorOptions);
    this.statusCode = props.statusCode;
    this.message = props.message;
    this.description = props.description;
    this.additionalProperties = props.additionalProperties;
    this.details = props.details;
  }
}
