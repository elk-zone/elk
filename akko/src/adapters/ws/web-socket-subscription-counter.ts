import { type WebSocketSubscriptionCounter } from "../../interfaces";

export class WebSocketSubscriptionCounterImpl
  implements WebSocketSubscriptionCounter
{
  private counts = new Map<string, number>();

  count(stream: string, params?: Record<string, unknown>): number {
    const key = this.hash(stream, params);

    return this.counts.get(key) ?? 0;
  }

  increment(stream: string, params?: Record<string, unknown>): void {
    const key = this.hash(stream, params);

    if (!this.counts.has(key)) {
      this.counts.set(key, 0);
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.counts.set(key, this.counts.get(key)! + 1);
  }

  decrement(stream: string, params?: Record<string, unknown>): void {
    const key = this.hash(stream, params);

    if (!this.counts.has(key)) {
      throw new Error("Cannot decrement non-existent count");
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.counts.set(key, this.counts.get(key)! - 1);
  }

  private hash(stream: string, params?: Record<string, unknown>): string {
    return JSON.stringify({ stream, params });
  }
}
