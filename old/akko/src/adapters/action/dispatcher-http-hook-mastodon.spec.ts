import { httpGet, HttpMockImpl, httpPost } from "../../__mocks__";
import { MastoHttpError, MastoTimeoutError } from "../errors";
import { HttpActionDispatcher } from "./dispatcher-http";
import { HttpActionDispatcherHookMastodon } from "./dispatcher-http-hook-mastodon";

describe("DispatcherHttp", () => {
  afterEach(() => {
    httpGet.mockClear();
    httpPost.mockClear();
  });

  it("waits for media attachment to be created", async () => {
    const http = new HttpMockImpl();
    const dispatcher = new HttpActionDispatcher(
      http,
      new HttpActionDispatcherHookMastodon(http),
    );

    httpPost.mockResolvedValueOnce({ id: "1" });

    httpGet
      .mockRejectedValueOnce(
        new MastoHttpError({ statusCode: 404, message: "Not Found" }),
      )
      .mockRejectedValueOnce(
        new MastoHttpError({ statusCode: 404, message: "Not Found" }),
      )
      .mockResolvedValueOnce({ id: "1", url: "https://example.com" });

    const media = await dispatcher.dispatch({
      type: "create",
      path: "/api/v2/media",
      data: undefined,
      meta: {},
    });

    expect(media).toHaveProperty("id", "1");
    expect(media).toHaveProperty("url", "https://example.com");
    expect(httpGet).toHaveBeenCalledTimes(3);
  });

  it("throws an error if media processing did not finish", async () => {
    const http = new HttpMockImpl();
    const dispatcher = new HttpActionDispatcher(
      http,
      new HttpActionDispatcherHookMastodon(http, 1),
    );

    httpPost.mockResolvedValueOnce({ id: "1" });
    httpGet.mockRejectedValue(
      new MastoHttpError({ statusCode: 404, message: "Not Found" }),
    );

    const promise = dispatcher.dispatch({
      type: "create",
      path: "/api/v2/media",
      data: undefined,
      meta: {},
    });

    await expect(promise).rejects.toBeInstanceOf(MastoTimeoutError);
  });

  it("rethrows errors for media processing", async () => {
    const http = new HttpMockImpl();
    const dispatcher = new HttpActionDispatcher(
      http,
      new HttpActionDispatcherHookMastodon(http),
    );

    httpPost.mockResolvedValueOnce({ id: "1" });
    httpGet.mockRejectedValueOnce(new Error("Unknown error"));

    const promise = dispatcher.dispatch({
      type: "create",
      path: "/api/v2/media",
      data: undefined,
      meta: {},
    });

    await expect(promise).rejects.toBeInstanceOf(Error);
  });

  it("skips media polling if `skipPolling` is passed", async () => {
    const http = new HttpMockImpl();
    const dispatcher = new HttpActionDispatcher(
      http,
      new HttpActionDispatcherHookMastodon(http),
    );

    httpPost.mockResolvedValueOnce({ id: "1" });

    const media = await dispatcher.dispatch({
      type: "create",
      path: "/api/v2/media",
      data: {
        skipPolling: true,
      },
      meta: {},
    });

    expect(media).toHaveProperty("id", "1");
    expect(httpGet).toHaveBeenCalledTimes(0);
  });
});
