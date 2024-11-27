import crypto from "node:crypto";

import { type mastodon } from "../../src";
import { getMockImage } from "../../test-utils/image";

describe("websocket", () => {
  it("streams public", async () => {
    await using session = await sessions.acquire({ waitForWs: true });
    const random = crypto.randomBytes(16).toString("hex");
    using subscription = session.ws.public.subscribe();

    const eventsPromise = subscription
      .values()
      .filter((e): e is mastodon.streaming.UpdateEvent => e.event === "update")
      .filter((e) => e.payload.content.includes(random))
      .take(1)
      .toArray();

    const status = await session.rest.v1.statuses.create({
      status: random,
    });

    try {
      const [event] = await eventsPromise;
      expect(event.payload.id).toBe(status.id);
    } finally {
      await session.rest.v1.statuses.$select(status.id).remove();
    }
  });

  it("streams public:media", async () => {
    await using session = await sessions.acquire({ waitForWs: true });
    const random = crypto.randomBytes(16).toString("hex");
    using subscription = session.ws.public.media.subscribe();

    const eventsPromise = subscription
      .values()
      .filter((e): e is mastodon.streaming.UpdateEvent => e.event === "update")
      .filter((e) => e.payload.content.includes(random))
      .take(1)
      .toArray();

    const media = await session.rest.v2.media.create({
      file: await getMockImage(),
    });
    const status = await session.rest.v1.statuses.create({
      status: random,
      mediaIds: [media.id],
      visibility: "public",
    });

    try {
      const [event] = await eventsPromise;
      expect(event.payload.id).toBe(status.id);
    } finally {
      await session.rest.v1.statuses.$select(status.id).remove();
    }
  });

  it("streams public:local", async () => {
    await using session = await sessions.acquire({ waitForWs: true });
    const random = crypto.randomBytes(16).toString("hex");
    using subscription = session.ws.public.local.subscribe();

    const eventsPromise = subscription
      .values()
      .filter((e): e is mastodon.streaming.UpdateEvent => e.event === "update")
      .filter((e) => e.payload.content.includes(random))
      .take(1)
      .toArray();

    const status = await session.rest.v1.statuses.create({
      status: random,
      visibility: "public",
    });

    try {
      const [event] = await eventsPromise;
      expect(event.payload.id).toBe(status.id);
    } finally {
      await session.rest.v1.statuses.$select(status.id).remove();
    }
  });

  it("streams public:local:media", async () => {
    await using session = await sessions.acquire({ waitForWs: true });
    const random = crypto.randomBytes(16).toString("hex");
    using subscription = session.ws.public.local.media.subscribe();

    const eventsPromise = subscription
      .values()
      .filter((e): e is mastodon.streaming.UpdateEvent => e.event === "update")
      .filter((e) => e.payload.content.includes(random))
      .take(1)
      .toArray();

    const media = await session.rest.v2.media.create({
      file: await getMockImage(),
    });

    const status = await session.rest.v1.statuses.create({
      status: random,
      mediaIds: [media.id],
      visibility: "public",
    });

    try {
      const [event] = await eventsPromise;
      expect(event.payload.id).toBe(status.id);
    } finally {
      await session.rest.v1.statuses.$select(status.id).remove();
    }
  });

  it("streams hashtag", async () => {
    await using session = await sessions.acquire({ waitForWs: true });
    const hashtag = `tag_${crypto.randomBytes(4).toString("hex")}`;
    using subscription = session.ws.hashtag.subscribe({ tag: hashtag });

    const eventsPromise = subscription
      .values()
      .filter((e): e is mastodon.streaming.UpdateEvent => e.event === "update")
      .filter((e) => e.payload.content.includes(hashtag))
      .take(1)
      .toArray();

    const status = await session.rest.v1.statuses.create({
      status: "#" + hashtag,
    });

    try {
      const [event] = await eventsPromise;
      expect(event.payload.id).toBe(status.id);
    } finally {
      await session.rest.v1.statuses.$select(status.id).remove();
    }
  });

  it("streams hashtag:local", async () => {
    await using session = await sessions.acquire({ waitForWs: true });
    const hashtag = `tag_${crypto.randomBytes(4).toString("hex")}`;
    using subscription = session.ws.hashtag.local.subscribe({
      tag: hashtag,
    });

    const eventsPromise = subscription
      .values()
      .filter((e): e is mastodon.streaming.UpdateEvent => e.event === "update")
      .filter((e) => e.payload.content.includes(hashtag))
      .take(1)
      .toArray();

    const status = await session.rest.v1.statuses.create({
      status: "#" + hashtag,
    });

    try {
      const [event] = await eventsPromise;
      expect(event.payload.id).toBe(status.id);
    } finally {
      await session.rest.v1.statuses.$select(status.id).remove();
    }
  });

  it("streams user", async () => {
    await using alice = await sessions.acquire({ waitForWs: true });
    await using bob = await sessions.acquire();
    using subscription = alice.ws.user.subscribe();

    const eventsPromise = subscription
      .values()
      .filter(
        (e): e is mastodon.streaming.NotificationEvent =>
          e.event === "notification",
      )
      .take(1)
      .toArray();

    await bob.rest.v1.accounts.$select(alice.id).unfollow();
    await bob.rest.v1.accounts.$select(alice.id).follow();

    try {
      const [e1] = await eventsPromise;
      expect(e1.payload.type).toBe("follow");
      expect(e1.payload.account.id).toBe(bob.id);
    } finally {
      await bob.rest.v1.accounts.$select(alice.id).unfollow();
    }
  });

  it("streams user:notification", async () => {
    await using alice = await sessions.acquire({ waitForWs: true });
    await using bob = await sessions.acquire();
    using subscription = alice.ws.user.notification.subscribe();

    const eventsPromise = subscription
      .values()
      .filter(
        (e): e is mastodon.streaming.NotificationEvent =>
          e.event === "notification",
      )
      .filter((e) => e.payload.type === "follow")
      .take(1)
      .toArray();

    await bob.rest.v1.accounts.$select(alice.id).follow();

    try {
      const [e1] = await eventsPromise;
      expect(e1.payload.type).toBe("follow");
      expect(e1.payload.account.id).toBe(bob.id);
    } finally {
      await bob.rest.v1.accounts.$select(alice.id).unfollow();
    }
  });

  test.todo("streams list (it often times out for some reason)");
  /*
  it("streams list", () => {
    return sessions.use(2, async ([alice, bob]) => {
      await alice.ws.prepare();
      const list = await alice.rest.v1.lists.create({ title: "test" });
      using subscription = alice.ws.list.subscribe({ list: list.id });

      const eventsPromise = subscription
        .values()
        .filter(
          (e): e is mastodon.streaming.UpdateEvent => e.event === "update",
        )
        .take(1)
        .toArray();

      // Wait for the list to be created
      await waitForCondition(async () => {
        const result = await alice.rest.v1.lists.$select(list.id).fetch();
        return result.id === list.id;
      });

      await bob.rest.v1.statuses.create({
        status: "a post from bob",
      });

      try {
        await alice.rest.v1.accounts.$select(bob.id).follow();
        await alice.rest.v1.lists.$select(list.id).accounts.create({
          accountIds: [bob.id],
        });

        const [e1] = await eventsPromise;
        expect(e1.payload.account.id).toBe(bob.id);
      } finally {
        await alice.rest.v1.lists.$select(list.id).remove();
        await alice.rest.v1.accounts.$select(bob.id).unfollow();
      }
    });
  });
  */
});
