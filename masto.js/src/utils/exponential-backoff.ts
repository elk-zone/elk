import { CustomError } from "ts-custom-error";

import { sleep } from "./sleep";

export class ExponentialBackoffError extends CustomError {
  constructor(attempts: number, options?: ErrorOptions) {
    super(`Maximum number of attempts reached: ${attempts}`, options);
  }
}

export interface ExponentialBackoffProps {
  readonly base?: number;
  readonly factor?: number;
  readonly maxAttempts?: number;
}

// https://en.wikipedia.org/wiki/Exponential_backoff
export class ExponentialBackoff {
  private attempts = 0;

  constructor(private readonly props: ExponentialBackoffProps = {}) {}

  async sleep(): Promise<void> {
    if (this.attempts >= this.maxAttempts) {
      throw new ExponentialBackoffError(this.attempts);
    }

    await sleep(this.timeout);
    this.attempts++;
  }

  clear(): void {
    this.attempts = 0;
  }

  private get factor(): number {
    return this.props.factor ?? 1000;
  }

  private get base(): number {
    return this.props.base ?? 2;
  }

  private get maxAttempts(): number {
    return this.props.maxAttempts ?? Number.POSITIVE_INFINITY;
  }

  private get timeout(): number {
    return this.factor * this.base ** this.attempts;
  }
}
