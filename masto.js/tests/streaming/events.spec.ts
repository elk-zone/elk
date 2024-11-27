import assert from "node:assert";
import crypto from "node:crypto";

import { sleep } from "../../src/utils";

describe("events", () => {
  it("streams update, status.update, and delete event", async () => {
    await using session = await sessions.acquire({ waitForWs: true });
    const tag = `tag_${crypto.randomBytes(4).toString("hex")}`;
    using subscription = session.ws.hashtag.local.subscribe({ tag });
    const eventsPromise = subscription.values().take(3).toArray();

    await sleep(1000);
    const status = await session.rest.v1.statuses.create({
      status: `test1 #${tag}`,
    });
    await sleep(1000);
    await session.rest.v1.statuses.$select(status.id).update({
      status: `test2 #${tag}`,
    });
    await sleep(1000);
    await session.rest.v1.statuses.$select(status.id).remove();

    const [e1, e2, e3] = await eventsPromise;
    assert(e1.event === "update");
    expect(e1.payload.content).toMatch(/test1/);
    assert(e2.event === "status.update");
    expect(e2.payload.content).toMatch(/test2/);
    assert(e3.event === "delete");
    expect(e3.payload).toBe(status.id);
  });

  test.todo("streams filters_changed event");
  // it("streams filters_changed event", async () => {
  //   await using session = await sessions.acquire({ waitForWs: true });
  //   using subscription = session.ws.user.subscribe();
  //   const eventsPromise = subscription.values().take(1).toArray();

  //   const filter = await session.rest.v2.filters.create({
  //     title: "test",
  //     context: ["public"],
  //     keywordsAttributes: [{ keyword: "TypeScript" }],
  //   });
  //   await sleep(1000);
  //   await session.rest.v2.filters.$select(filter.id).remove();

  //   const [e] = await eventsPromise;
  //   assert(e.event === "filters_changed");
  //   expect(e.payload).toBeUndefined();
  // });

  it("streams notification", async () => {
    await using alice = await sessions.acquire({ waitForWs: true });
    await using bob = await sessions.acquire();

    using subscription = alice.ws.user.notification.subscribe();
    const eventsPromise = subscription.values().take(1).toArray();

    await bob.rest.v1.accounts.$select(alice.id).follow();

    try {
      const [e] = await eventsPromise;
      assert(e.event === "notification");
      expect(e.payload.account.id).toBe(bob.id);
    } finally {
      await bob.rest.v1.accounts.$select(alice.id).unfollow();
    }
  });

  it("streams conversation", async () => {
    await using alice = await sessions.acquire({ waitForWs: true });
    await using bob = await sessions.acquire();

    using subscription = alice.ws.direct.subscribe();
    const eventsPromise = subscription.values().take(1).toArray();

    await alice.rest.v1.accounts.$select(bob.id).follow();
    await bob.rest.v1.accounts.$select(alice.id).follow();

    const status = await bob.rest.v1.statuses.create({
      status: `@${alice.account.acct} Hello there`,
      visibility: "direct",
    });

    try {
      const [e] = await eventsPromise;
      assert(e.event === "conversation");
      expect(e.payload.lastStatus?.id).toBe(status.id);
    } finally {
      await bob.rest.v1.statuses.$select(status.id).remove();
      await alice.rest.v1.accounts.$select(bob.id).unfollow();
      await bob.rest.v1.accounts.$select(alice.id).unfollow();
    }
  });

  test.todo("announcement");

  test.todo("notifications_merged");
});
