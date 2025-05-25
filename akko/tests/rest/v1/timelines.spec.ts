import waitForExpect from "@sadams/wait-for-expect";

import { type akkoma } from "../../../src";

describe("timeline", () => {
  it("can iterate over timeline", async () => {
    await using client = await sessions.acquire();
    let statuses: akkoma.v1.Status[] | undefined;
    for await (const entry of client.rest.v1.timelines.public.list()) {
      statuses = entry;
      break;
    }
    expect(statuses).not.toBeUndefined();
  });

  it("returns home", async () => {
    await using client = await sessions.acquire();
    const status = await client.rest.v1.statuses.create({
      status: "own post",
    });

    let statuses: akkoma.v1.Status[] | undefined;

    await waitForExpect(async () => {
      statuses = await client.rest.v1.timelines.home.list();
      expect(statuses).toContainEqual(status);
    });
  });

  it("returns public", async () => {
    await using alice = await sessions.acquire();
    await using bob = await sessions.acquire();

    const status = await bob.rest.v1.statuses.create({
      status: "public post",
    });
    const statuses = await alice.rest.v1.timelines.public.list();
    expect(statuses).toContainEqual(status);
  });

  it("returns bubble", async () => {
    await using alice = await sessions.acquire();
    await using bob = await sessions.acquire();

    const status = await bob.rest.v1.statuses.create({
      status: "bubble post",
    });
    const statuses = await alice.rest.v1.timelines.bubble.list();
    expect(statuses).toContainEqual(status);
  });

  it("returns hashtag", async () => {
    await using client = await sessions.acquire();
    const status = await client.rest.v1.statuses.create({
      status: "#mastodon",
    });
    const statuses = await client.rest.v1.timelines.tag
      .$select("mastodon")
      .list();
    expect(statuses).toContainEqual(status);
  });

  it("returns hashtag in camel case", async () => {
    await using client = await sessions.acquire();

    const status = await client.rest.v1.statuses.create({
      status: "#CamelCase",
    });
    const statuses = await client.rest.v1.timelines.tag
      .$select("CamelCase")
      .list();
    expect(statuses).toContainEqual(status);
  });

  it("returns list", async () => {
    await using client = await sessions.acquire();
    const list = await client.rest.v1.lists.create({ title: "List" });
    const statuses = await client.rest.v1.timelines.list
      .$select(list.id)
      .list();
    expect(statuses).toEqual([]);
  });

  test.todo("returns direct");

  test.todo("returns link (hard to emulate)");
});
