import { SerializerNativeImpl } from "../serializers";
import { HttpConfigImpl } from "./http-config";

describe("Config", () => {
  it("creates header", () => {
    const config = new HttpConfigImpl(
      {
        url: "https://mastodon.social",
        accessToken: "token",
        requestInit: {
          headers: {
            "X-Header-Specified-In-Config": "true",
            "User-Agent": "user agent specified in config",
          },
        },
      },
      new SerializerNativeImpl(),
    );

    const requestInit = config.mergeRequestInitWithDefaults({
      headers: { "User-Agent": "user agent per request" },
      keepalive: true,
      redirect: "follow",
    });
    const request = new Request("https://example.com", requestInit);

    expect(request.keepalive).toBe(true);
    expect(request.redirect).toBe("follow");
    expect(request.headers.get("Authorization")).toBe("Bearer token");
    expect(request.headers.get("X-Header-Specified-In-Config")).toBe("true");
    expect(request.headers.get("User-Agent")).toBe("user agent per request");
  });

  it("overrides content-type header", () => {
    const config = new HttpConfigImpl(
      {
        url: "https://mastodon.social",
        accessToken: "token",
      },
      new SerializerNativeImpl(),
    );

    const requestInit = config.mergeRequestInitWithDefaults({
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const request = new Request("https://example.com", requestInit);

    expect(request.headers.get("Authorization")).toBe("Bearer token");
    expect(request.headers.get("Content-Type")).toBe("multipart/form-data");
  });

  it("merges multiple signals", () => {
    const abc1 = new AbortController();
    const abc2 = new AbortController();

    const config = new HttpConfigImpl(
      {
        url: "https://mastodon.social",
        accessToken: "token",
        requestInit: {
          signal: abc1.signal,
        },
      },
      new SerializerNativeImpl(),
    );

    const requestInit = config.mergeRequestInitWithDefaults({
      signal: abc2.signal,
    });
    const request = new Request("https://example.com", requestInit);

    expect(request.signal.aborted).toBe(false);
    [abc1, abc2][Math.floor(Math.random() * 2)].abort();
    expect(request.signal.aborted).toBe(true);
  });

  it("falls back to default timeout if timeout = undefined (#1097)", () => {
    jest.spyOn(AbortSignal, "timeout");

    const config = new HttpConfigImpl(
      {
        url: "https://mastodon.social",
        accessToken: "token",
      },
      new SerializerNativeImpl(),
    );

    const requestInit = config.mergeRequestInitWithDefaults();
    const request = new Request("https://example.com", requestInit);

    expect(request.signal.aborted).toBe(false);
    expect(AbortSignal.timeout).not.toHaveBeenCalled();

    jest.restoreAllMocks();
  });

  it("resolves HTTP path", () => {
    const config = new HttpConfigImpl(
      {
        url: "https://mastodon.social",
        accessToken: "token",
      },
      new SerializerNativeImpl(),
    );

    const url = config.resolvePath("/api/v1/yay").toString();
    expect(url).toEqual("https://mastodon.social/api/v1/yay");
  });

  it("resolves HTTP path with query", () => {
    const config = new HttpConfigImpl(
      {
        url: "https://mastodon.social",
        accessToken: "token",
      },
      new SerializerNativeImpl(),
    );

    const url = config
      .resolvePath("/api/v1/yay", { query: "true", list: ["1", "2", "3"] })
      .toString();
    expect(url).toEqual(
      "https://mastodon.social/api/v1/yay?query=true&list[]=1&list[]=2&list[]=3",
    );
  });

  it("resolves HTTP path with query (string)", () => {
    const config = new HttpConfigImpl(
      {
        url: "https://mastodon.social",
        accessToken: "token",
      },
      new SerializerNativeImpl(),
    );

    const url = config
      .resolvePath("/api/v1/yay", "query=true&list[]=1&list[]=2&list[]=3")
      .toString();
    expect(url).toEqual(
      "https://mastodon.social/api/v1/yay?query=true&list[]=1&list[]=2&list[]=3",
    );
  });

  it("preserves query parameters in the URL when no query parameters specified", () => {
    const config = new HttpConfigImpl(
      {
        url: "https://mastodon.social",
        accessToken: "token",
      },
      new SerializerNativeImpl(),
    );

    const url = config.resolvePath("/path/to/somewhere?foo=bar").toString();
    expect(url).toEqual("https://mastodon.social/path/to/somewhere?foo=bar");
  });

  it("revokes query parameters in the URL when query parameters specified", () => {
    const config = new HttpConfigImpl(
      {
        url: "https://mastodon.social",
        accessToken: "token",
      },
      new SerializerNativeImpl(),
    );

    const url = config
      .resolvePath("/path/to/somewhere?foo=bar", { foo2: "bar2" })
      .toString();
    expect(url).toEqual("https://mastodon.social/path/to/somewhere?foo2=bar2");
  });
});
