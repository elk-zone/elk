import node_http from "node:http";

import getPort from "get-port";

import { HttpConfigImpl } from "../config";
import { type MastoHttpError, MastoTimeoutError } from "../errors";
import { SerializerNativeImpl } from "../serializers";
import { HttpNativeImpl } from "./http-native-impl";

describe("HttpNativeImpl", () => {
  it("timeouts", async () => {
    const server = node_http.createServer((_, res) => {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end("{}");
    });

    const port = await getPort();
    server.listen(port);

    const serializer = new SerializerNativeImpl();
    const http = new HttpNativeImpl(
      serializer,
      new HttpConfigImpl(
        {
          url: `http://localhost:${port}`,
          timeout: 1,
        },
        serializer,
      ),
    );

    await expect(() => http.get("/")).rejects.toThrow(MastoTimeoutError);

    server.close();
  });

  it("throws an error if server returned non-JSON", async () => {
    const server = node_http.createServer((_, res) => {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("Hello World\n");
    });

    const port = await getPort();
    server.listen(port);

    const serializer = new SerializerNativeImpl();
    const http = new HttpNativeImpl(
      serializer,
      new HttpConfigImpl({ url: `http://localhost:${port}` }, serializer),
    );

    await expect(() =>
      http.get("/"),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"The server returned data with an unknown encoding."`,
    );

    server.close();
  });

  it("throws an error if server returned non-JSON error", async () => {
    const server = node_http.createServer((_, res) => {
      res.writeHead(503, { "Content-Type": "text/plain" });
      res.end("Hello World\n");
    });

    const port = await getPort();
    server.listen(port);

    const serializer = new SerializerNativeImpl();
    const http = new HttpNativeImpl(
      serializer,
      new HttpConfigImpl({ url: `http://localhost:${port}` }, serializer),
    );

    await expect(() =>
      http.get("/"),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"The server returned data with an unknown encoding. The server may be down."`,
    );

    server.close();
  });

  it("collects any additional properties if provided", async () => {
    const server = node_http.createServer((_, res) => {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "unknown error", foo: "bar" }));
    });

    const port = await getPort();
    server.listen(port);

    const serializer = new SerializerNativeImpl();
    const http = new HttpNativeImpl(
      serializer,
      new HttpConfigImpl({ url: `http://localhost:${port}` }, serializer),
    );

    const error = await http.get("/").then(
      () => {
        throw new Error("should not happen");
      },
      (error) => error as MastoHttpError,
    );

    expect(error.message).toEqual("unknown error");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((error.additionalProperties as any).foo).toEqual("bar");

    server.close();
  });
});
