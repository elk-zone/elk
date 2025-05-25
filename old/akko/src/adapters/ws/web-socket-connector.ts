import WebSocket from "isomorphic-ws";

import { type Logger, type WebSocketConnector } from "../../interfaces";
import {
  createPromiseWithResolvers,
  ExponentialBackoff,
  type PromiseWithResolvers,
} from "../../utils";
import { MastoWebSocketError } from "../errors";
import { waitForClose, waitForOpen } from "./wait-for-events";

interface WebSocketConnectorImplProps {
  readonly constructorParameters: ConstructorParameters<typeof WebSocket>;
  readonly implementation?: unknown;
  readonly maxAttempts?: number;
}

export class WebSocketConnectorImpl implements WebSocketConnector {
  private ws?: WebSocket;

  private killed = false;
  private queue: PromiseWithResolvers<WebSocket>[] = [];
  private backoff: ExponentialBackoff;

  constructor(
    private readonly props: WebSocketConnectorImplProps,
    private readonly logger?: Logger,
  ) {
    this.backoff = new ExponentialBackoff({
      maxAttempts: this.props.maxAttempts,
    });
    this.spawn();
  }

  acquire(): Promise<WebSocket> {
    if (this.killed) {
      throw new MastoWebSocketError("WebSocket closed");
    }

    if (this.ws) {
      return Promise.resolve(this.ws);
    }

    const promiseWithResolvers = createPromiseWithResolvers<WebSocket>();
    this.queue.push(promiseWithResolvers);
    return promiseWithResolvers.promise;
  }

  async *[Symbol.asyncIterator](): AsyncIterableIterator<WebSocket> {
    while (!this.killed) {
      yield await this.acquire();
    }
  }

  kill(): void {
    this.killed = true;
    this.ws?.close();
    this.backoff.clear();

    for (const { reject } of this.queue) {
      reject(new MastoWebSocketError("WebSocket closed"));
    }

    this.queue = [];
  }

  private async spawn() {
    while (!this.killed) {
      try {
        await this.backoff.sleep();
      } catch {
        break;
      }

      try {
        this.logger?.log("info", "Connecting to WebSocket...");
        {
          const ctor = (this.props.implementation ??
            WebSocket) as typeof WebSocket;
          const ws = new ctor(...this.props.constructorParameters);
          await waitForOpen(ws);
          this.ws = ws;
        }
        this.logger?.log("info", "Connected to WebSocket");

        for (const { resolve } of this.queue) {
          resolve(this.ws);
        }
        this.queue = [];

        await waitForClose(this.ws);
        this.logger?.log("info", "WebSocket closed");
        this.backoff.clear();
      } catch (error) {
        this.logger?.log("error", "WebSocket error:", error);
      }

      this.ws = undefined;
    }

    for (const { reject } of this.queue) {
      reject(
        new MastoWebSocketError(
          `Failed to connect to WebSocket after ${this.props.maxAttempts} attempts`,
        ),
      );
    }

    this.queue = [];
  }
}
