import WebSocket from "isomorphic-ws";

export function waitForOpen(ws: WebSocket): Promise<void> {
  if (ws.readyState === WebSocket.OPEN) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve, reject) => {
    const handleError = (error: WebSocket.ErrorEvent): void => {
      reject(error);
    };

    const handleClose = (): void => {
      reject(new Error("WebSocket closed"));
    };

    const handleOpen = (): void => {
      resolve();
    };

    ws.addEventListener("error", handleError, { once: true });
    ws.addEventListener("close", handleClose, { once: true });
    ws.addEventListener("open", handleOpen, { once: true });
  });
}

export function waitForClose(ws: WebSocket): Promise<void> {
  if (ws.readyState === WebSocket.CLOSED) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    const handleClose = (): void => {
      resolve();
    };

    ws.addEventListener("error", handleClose, { once: true });
    ws.addEventListener("close", handleClose, { once: true });
  });
}
