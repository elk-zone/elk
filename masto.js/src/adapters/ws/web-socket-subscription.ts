import type WebSocket from "isomorphic-ws";

import {
  type Logger,
  type Serializer,
  type WebSocketConnector,
  type WebSocketSubscriptionCounter,
} from "../../interfaces";
import { type mastodon } from "../../mastodon";
import { MastoUnexpectedError } from "../errors";
import { toAsyncIterable } from "./async-iterable";

export class WebSocketSubscription implements mastodon.streaming.Subscription {
  private connection?: WebSocket;

  constructor(
    private readonly connector: WebSocketConnector,
    private readonly counter: WebSocketSubscriptionCounter,
    private readonly serializer: Serializer,
    private readonly stream: string,
    private readonly logger?: Logger,
    private readonly params?: Record<string, unknown>,
  ) {}

  async *values(): AsyncIterableIterator<mastodon.streaming.Event> {
    try {
      this.logger?.log("info", "Subscribing to stream", this.stream);

      for await (this.connection of this.connector) {
        const data = this.serializer.serialize("json", {
          type: "subscribe",
          stream: this.stream,
          ...this.params,
        });

        this.logger?.log("debug", "↑ WEBSOCKET", data);
        this.connection.send(data);
        this.counter.increment(this.stream, this.params);

        const messages = toAsyncIterable(this.connection);

        for await (const message of messages) {
          const event = this.parseMessage(message.data as string);

          if (!this.test(event)) {
            continue;
          }

          this.logger?.log("debug", "↓ WEBSOCKET", event);
          yield event;
        }
      }
    } finally {
      this.unsubscribe();
    }
  }

  unsubscribe(): void {
    if (!this.connection) {
      return;
    }

    this.counter.decrement(this.stream, this.params);

    if (this.counter.count(this.stream, this.params) <= 0) {
      const data = this.serializer.serialize("json", {
        type: "unsubscribe",
        stream: this.stream,
        ...this.params,
      });

      this.connection.send(data);
    }

    this.connection = undefined;
  }

  [Symbol.asyncIterator](): AsyncIterableIterator<mastodon.streaming.Event> {
    return this.values();
  }

  /**
   * @experimental This is an experimental API.
   */
  [Symbol.dispose](): void {
    this.unsubscribe();
  }

  private test(event: mastodon.streaming.Event): boolean {
    // subscribe("hashtag", { tag: "foo" }) -> ["hashtag", "foo"]
    // subscribe("list", { list: "foo" })   -> ["list", "foo"]
    const params = this.params ?? {};
    const extra = Object.values(params) as string[];
    const stream = [this.stream, ...extra];
    return stream.every((s) => event.stream.includes(s));
  }

  private parseMessage(rawEvent: string): mastodon.streaming.Event {
    const data = this.serializer.deserialize<mastodon.streaming.RawEvent>(
      "json",
      rawEvent,
    );

    if ("error" in data) {
      throw new MastoUnexpectedError(data.error);
    }

    const payload =
      data.event === "delete" || data.payload == undefined
        ? data.payload
        : this.serializer.deserialize("json", data.payload);

    return {
      stream: data.stream,
      event: data.event,
      payload: payload,
    } as mastodon.streaming.Event;
  }
}
