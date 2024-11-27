import { parseLinkHeader } from "./link-header";

describe("parseLinkHeader", () => {
  it("parse link header", () => {
    const result = parseLinkHeader(
      `<https://mastodon.social/api/v1/timelines/home?max_id=109382006402042919>; rel="next", <https://mastodon.social/api/v1/timelines/home?min_id=109382039876197520>; rel="prev"`,
    );

    expect(result).toEqual(
      new Map([
        [
          "next",
          "https://mastodon.social/api/v1/timelines/home?max_id=109382006402042919",
        ],
        [
          "prev",
          "https://mastodon.social/api/v1/timelines/home?min_id=109382039876197520",
        ],
      ]),
    );
  });

  it("parses link header regardless of the order", () => {
    const result = parseLinkHeader(
      `<https://mastodon.social/api/v1/timelines/home?min_id=109382039876197520>; rel="prev", <https://mastodon.social/api/v1/timelines/home?max_id=109382006402042919>; rel="next"`,
    );

    expect(result).toEqual(
      new Map([
        [
          "prev",
          "https://mastodon.social/api/v1/timelines/home?min_id=109382039876197520",
        ],
        [
          "next",
          "https://mastodon.social/api/v1/timelines/home?max_id=109382006402042919",
        ],
      ]),
    );
  });

  it("parses link header with query string", () => {
    const result = parseLinkHeader(
      `<https://mastodon.social/api/v1/notifications?types[]=mention&max_id=123456>; rel="next", <https://mastodon.social/api/v1/notifications?types[]=mention>; rel="prev"`,
    );

    expect(result).toEqual(
      new Map([
        [
          "next",
          "https://mastodon.social/api/v1/notifications?types[]=mention&max_id=123456",
        ],
        [
          "prev",
          "https://mastodon.social/api/v1/notifications?types[]=mention",
        ],
      ]),
    );
  });

  it("parses link header with title attribute", () => {
    const result = parseLinkHeader(
      `<https://mastodon.social/api/v1/notifications?types[]=mention&max_id=123456>; rel="next"; title="Next Page", <https://mastodon.social/api/v1/notifications?types[]=mention>; rel="prev"; title="Previous Page"`,
    );

    expect(result).toEqual(
      new Map([
        [
          "next",
          "https://mastodon.social/api/v1/notifications?types[]=mention&max_id=123456",
        ],
        [
          "prev",
          "https://mastodon.social/api/v1/notifications?types[]=mention",
        ],
      ]),
    );
  });
});
