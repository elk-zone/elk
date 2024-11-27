import getPort from "get-port";
import { WebSocket, WebSocketServer } from "isomorphic-ws";

import { sleep } from "../../utils";
import { MastoWebSocketError } from "../errors";
import { WebSocketConnectorImpl } from "./web-socket-connector";

describe("WebSocketConnector", () => {
  it("returns existing connection if it exists", async () => {
    const port = await getPort();
    const server = new WebSocketServer({ port });
    const connector = new WebSocketConnectorImpl({
      constructorParameters: [`ws://localhost:${port}`],
    });

    const ws1 = await connector.acquire();
    const ws2 = await connector.acquire();

    expect(ws1).toBe(ws2);

    server.close();
    connector.kill();
  });

  it("rejects if WebSocket closes", async () => {
    const connector = new WebSocketConnectorImpl({
      constructorParameters: [`ws://localhost:0`],
    });
    const promise = connector.acquire();
    connector.kill();

    await expect(promise).rejects.toBeInstanceOf(MastoWebSocketError);
  });

  it("rejects if it reaches max attempts", async () => {
    const connector = new WebSocketConnectorImpl({
      constructorParameters: [`ws://localhost:0`],
      maxAttempts: 1,
    });

    const promise = connector.acquire();
    await expect(promise).rejects.toBeInstanceOf(MastoWebSocketError);
  });

  it("creates reconnection after connection closed", async () => {
    const port = await getPort();
    let server = new WebSocketServer({ port });

    const connector = new WebSocketConnectorImpl({
      constructorParameters: [`ws://localhost:${port}`],
    });
    const connections = connector[Symbol.asyncIterator]();

    // First connection
    const { value: ws } = await connections.next();
    await sleep(100);
    expect(ws.readyState).toBe(WebSocket.OPEN);

    // Close first connection
    for (const client of server.clients) client.close();
    server.close();
    await sleep(100);
    expect(ws.readyState).toBe(WebSocket.CLOSED);

    server = new WebSocketServer({ port });

    // Second connection
    const { value: ws2 } = await connections.next();
    await sleep(100);
    expect(ws2.readyState).toBe(WebSocket.OPEN);

    server.close();
    connector.kill();
  });
});
