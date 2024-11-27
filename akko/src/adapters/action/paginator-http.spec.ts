import { HttpMockImpl } from "../../__mocks__";
import { type HttpRequestParams } from "../../interfaces";
import { PaginatorHttp } from "./paginator-http";

describe("PaginatorHttp", () => {
  const http = new HttpMockImpl();

  beforeEach(() => {
    http.request.mockReturnValue({ headers: new Headers({}) });
  });

  afterEach(() => {
    http.clear();
  });

  it("sends a request", async () => {
    const paginator = new PaginatorHttp(http, "/v1/api/timelines", {
      foo: "bar",
    });
    await paginator.next();
    expect(http.request).toBeCalledWith({
      method: "GET",
      path: "/v1/api/timelines",
      search: { foo: "bar" },
    });
  });

  it("sends a request with await", async () => {
    const paginator = new PaginatorHttp(http, "/v1/api/timelines", {
      foo: "bar",
    });
    await paginator;
    expect(http.request).toBeCalledWith({
      method: "GET",
      path: "/v1/api/timelines",
      search: { foo: "bar" },
    });
  });

  it("parses the next url", async () => {
    http.request.mockReturnValue({
      headers: new Headers({
        link: '<https://mastodon.social/api/v1/timelines/home?max_id=109382006402042919>; rel="next", <https://mastodon.social/api/v1/timelines/home?min_id=109382039876197520>; rel="prev"',
      }),
    });
    const paginator = new PaginatorHttp(http, "/v1/api/timelines");
    await paginator.next();
    await paginator.next();
    expect(http.request).toBeCalledWith({
      method: "GET",
      search: "max_id=109382006402042919",
      path: "/api/v1/timelines/home",
    });
  });

  it("paginates with opposite direction when prev direction was set", async () => {
    http.request.mockReturnValue({
      headers: new Headers({
        link: '<https://mastodon.social/api/v1/timelines/home?max_id=109382006402042919>; rel="next", <https://mastodon.social/api/v1/timelines/home?min_id=109382039876197520>; rel="prev"',
      }),
      data: [],
    });

    let paginator = new PaginatorHttp(http, "/v1/api/timelines");
    expect(paginator.getDirection()).toBe("next");

    paginator = paginator.setDirection("prev");
    expect(paginator.getDirection()).toBe("prev");

    await paginator.next();
    await paginator.next();
    expect(http.request).toBeCalledWith({
      method: "GET",
      search: "min_id=109382039876197520",
      path: "/api/v1/timelines/home",
    });
  });

  it("parses the next url regardless of order", async () => {
    http.request.mockReturnValue({
      headers: new Headers({
        link: '<https://mastodon.social/api/v1/timelines/home?min_id=109382039876197520>; rel="prev", <https://mastodon.social/api/v1/timelines/home?max_id=109382006402042919>; rel="next"',
      }),
    });
    const paginator = new PaginatorHttp(http, "/v1/api/timelines");
    await paginator.next();
    await paginator.next();
    expect(http.request).toBeCalledWith({
      method: "GET",
      search: "max_id=109382006402042919",
      path: "/api/v1/timelines/home",
    } satisfies HttpRequestParams);
  });

  it("returns done when next link does not exist", async () => {
    const paginator = new PaginatorHttp(http, "/v1/api/timelines");
    await paginator.next();
    const result = await paginator.next();
    expect(result).toEqual({
      done: true,
    });
  });

  it("is AsyncIterable", async () => {
    const paginator = new PaginatorHttp(http, "/v1/api/timelines", {
      foo: "bar",
    });

    for await (const _ of paginator) {
      break;
    }

    expect(http.request).toBeCalledWith({
      method: "GET",
      path: "/v1/api/timelines",
      search: { foo: "bar" },
    });
  });

  it("returns AsyncIterable from values", async () => {
    const paginator = new PaginatorHttp(http, "/v1/api/timelines", {
      foo: "bar",
    });

    const values = paginator.values();

    for await (const _ of values) {
      break;
    }

    expect(http.request).toBeCalledWith({
      method: "GET",
      path: "/v1/api/timelines",
      search: { foo: "bar" },
    });
  });

  it("clones itself", async () => {
    const paginator1 = new PaginatorHttp(http, "/some/api", { query: "value" });
    const paginator2 = paginator1.clone();

    await paginator1.next();
    await paginator2.next();

    expect(http.request).toBeCalledTimes(2);
    expect(http.request).nthCalledWith(1, {
      method: "GET",
      search: { query: "value" },
      path: "/some/api",
    });
    expect(http.request).nthCalledWith(2, {
      method: "GET",
      search: { query: "value" },
      path: "/some/api",
    });

    expect(paginator1).not.toBe(paginator2);
  });

  it("terminates pagination by return", async () => {
    const paginator = new PaginatorHttp(http, "/v1/api/timelines");
    await paginator.return();
    const result = await paginator.next();
    expect(result).toEqual({
      done: true,
      value: undefined,
    });
  });

  it("terminates pagination by throw", async () => {
    const paginator = new PaginatorHttp(http, "/v1/api/timelines");
    await expect(() => paginator.throw("some error")).rejects.toBe(
      "some error",
    );
    const result = await paginator.next();
    expect(result).toEqual({
      done: true,
      value: undefined,
    });
  });

  it("parse array in url query string correctly", async () => {
    http.request.mockReturnValue({
      headers: new Headers({
        link: '<https://mastodon.social/api/v1/notifications?types[]=mention&max_id=123456>; rel="next", <https://mastodon.social/api/v1/notifications?types[]=mention>; rel="prev"',
      }),
    });
    const paginator = new PaginatorHttp(http, "/v1/api/notifications", {
      types: ["mention"],
    });
    await paginator.next();
    await paginator.next();
    expect(http.request).toBeCalledWith({
      method: "GET",
      path: "/api/v1/notifications",
      search: "types[]=mention&max_id=123456",
    });
  });

  it("is thenable", () => {
    const paginator = new PaginatorHttp(http, "/v1/api/timelines");
    const onFulfilled = jest.fn();
    paginator.then(onFulfilled);
    expect(onFulfilled).toBeCalledTimes(0);
  });

  it("can be converted to promise", async () => {
    const paginator = new PaginatorHttp(http, "/v1/api/timelines");
    expect(paginator.then()).toBeInstanceOf(Promise);
  });

  it("is thenable (error)", () => {
    const paginator = new PaginatorHttp(http, "/v1/api/timelines");
    http.request.mockImplementation(() => {
      throw new Error("mock error");
    });

    const onFulfilled = jest.fn();
    const onRejected = jest.fn();
    paginator.then(onFulfilled, onRejected);
    expect(onFulfilled).not.toBeCalled();
    expect(onRejected).toBeCalledTimes(0);
  });
});
