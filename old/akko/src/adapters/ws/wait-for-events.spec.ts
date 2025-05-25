import getPort from "get-port";
import WebSocket, { WebSocketServer } from "isomorphic-ws";

import { waitForClose, waitForOpen } from "./wait-for-events";

describe("waitForOpen", () => {
  it("waits for WebSocket to open", async () => {
    const port = await getPort();
    const server = new WebSocketServer({ port });
    const ws = new WebSocket(`ws://localhost:${port}`);

    const promise = waitForOpen(ws);

    await expect(promise).resolves.toBeUndefined();

    server.close();
    ws.close();
  });

  it("resolves if WebSocket is already open", async () => {
    const port = await getPort();
    const server = new WebSocketServer({ port });
    const ws = new WebSocket(`ws://localhost:${port}`);

    await waitForOpen(ws);
    const promise = waitForOpen(ws);

    await expect(promise).resolves.toBeUndefined();

    server.close();
    ws.close();
  });

  it("rejects if WebSocket closes", async () => {
    const ws = new WebSocket(`ws://localhost:0`);
    const promise = waitForOpen(ws);
    ws.close();
    await expect(promise).rejects.not.toBeUndefined();
  });
});

describe("waitForClose", () => {
  it("resolves if client closes WebSocket", async () => {
    const port = await getPort();
    const server = new WebSocketServer({ port });
    const ws = new WebSocket(`ws://localhost:${port}`);

    await waitForOpen(ws);
    const promise = waitForClose(ws);
    ws.close();
    await expect(promise).resolves.toBeUndefined();

    server.close();
  });

  it("resolves if WebSocket is already closed", async () => {
    const port = await getPort();
    const server = new WebSocketServer({ port });
    const ws = new WebSocket(`ws://localhost:${port}`);

    await waitForOpen(ws);
    ws.close();
    await waitForClose(ws);
    const promise = waitForClose(ws);
    await expect(promise).resolves.toBeUndefined();

    server.close();
  });

  it("resolves if server closes WebSocket", async () => {
    const port = await getPort();
    const server = new WebSocketServer({ port });
    const ws = new WebSocket(`ws://localhost:${port}`);

    server.on("connection", (ws) => {
      ws.close();
    });

    await waitForOpen(ws);
    const promise = waitForClose(ws);
    await expect(promise).resolves.toBeUndefined();

    ws.close();
    server.close();
  });
});
