import { type WebSocket } from "isomorphic-ws";

export interface WebSocketConnector extends AsyncIterable<WebSocket> {
  acquire(): Promise<WebSocket>;
  kill(): void;
}

export interface WebSocketSubscriptionCounter {
  count(stream: string, params?: Record<string, unknown>): number;
  increment(stream: string, params?: Record<string, unknown>): void;
  decrement(stream: string, params?: Record<string, unknown>): void;
}
