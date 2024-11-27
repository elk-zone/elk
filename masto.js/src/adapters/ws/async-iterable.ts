import { on } from "events-to-async";
import type WebSocket from "isomorphic-ws";

import { MastoUnexpectedError } from "../errors";

export async function* toAsyncIterable(
  ws: WebSocket,
): AsyncIterableIterator<WebSocket.MessageEvent> {
  const handleClose = async (e: WebSocket.CloseEvent) => {
    /* istanbul ignore next */
    if (!events.return) {
      throw new MastoUnexpectedError("events.return is undefined");
    }
    await events.return(e);
  };

  const handleError = async (e: WebSocket.ErrorEvent) => {
    /* istanbul ignore next */
    if (!events.return) {
      throw new MastoUnexpectedError("events.return is undefined");
    }
    await events.return(e);
  };

  const events = on<[WebSocket.MessageEvent]>((handler) => {
    ws.addEventListener("message", handler);
    ws.addEventListener("error", handleError);
    ws.addEventListener("close", handleClose);

    return () => {
      ws.removeEventListener("message", handler);
      ws.removeEventListener("error", handleError);
      ws.removeEventListener("close", handleClose);
    };
  });

  for await (const [event] of events) {
    yield event;
  }
}
