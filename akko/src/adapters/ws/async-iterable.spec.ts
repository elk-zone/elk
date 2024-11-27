import getPort from "get-port";
import { WebSocket, WebSocketServer } from "isomorphic-ws";

import { toAsyncIterable } from "./async-iterable";
import { waitForOpen } from "./wait-for-events";

describe("toAsyncIterable", () => {
  it("returns an async iterable", async () => {
    const port = await getPort();
    const server = new WebSocketServer({ port });
    const ws = new WebSocket(`ws://localhost:${port}`);
    await waitForOpen(ws);

    const iterable = toAsyncIterable(ws);

    expect(iterable).toBeInstanceOf(Object);
    expect(iterable[Symbol.asyncIterator]).toBeInstanceOf(Function);

    server.close();
    ws.close();
  });

  it("yields events", async () => {
    const port = await getPort();
    const server = new WebSocketServer({ port });
    const ws = new WebSocket(`ws://localhost:${port}`);

    server.on("connection", (socket) => {
      socket.send("test");
    });

    const iterable = toAsyncIterable(ws);
    const promise = iterable.next();
    const { value } = await promise;

    expect(value).toBeDefined();
    expect(value.data).toBe("test");

    server.close();
    ws.close();
  });

  it("returns when the socket closes", async () => {
    const port = await getPort();
    const server = new WebSocketServer({ port });

    server.on("connection", (socket) => {
      socket.close();
    });

    const ws = new WebSocket(`ws://localhost:${port}`);
    const iterable = toAsyncIterable(ws);

    const result = await iterable.next();
    expect(result.done).toBe(true);

    ws.close();
    server.close();
  });

  it("throws an error when the socket errors", async () => {
    const ws = new WebSocket(`ws://localhost:0`);

    const iterable = toAsyncIterable(ws);
    const result = await iterable.next();
    expect(result.done).toBe(true);

    ws.close();
  });
});
