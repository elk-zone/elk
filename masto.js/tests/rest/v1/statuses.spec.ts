import crypto from "node:crypto";

import { MastoHttpError } from "../../../src";

describe("status", () => {
  it("creates, updates, and removes a status", async () => {
    await using client = await sessions.acquire();
    const random = Math.random().toString();
    const { id } = await client.rest.v1.statuses.create({
      status: random,
      visibility: "direct",
    });

    let status = await client.rest.v1.statuses.$select(id).fetch();
    expect(status.content).toBe(`<p>${random}</p>`);

    const source = await client.rest.v1.statuses.$select(id).source.fetch();
    expect(source.text).toBe(random);

    const random2 = Math.random().toString();
    status = await client.rest.v1.statuses
      .$select(id)
      .update({ status: random2 });
    expect(status.content).toBe(`<p>${random2}</p>`);

    const history = await client.rest.v1.statuses
      .$select(status.id)
      .history.list();
    expect(history[0]).toEqual(
      expect.objectContaining({
        content: `<p>${random}</p>`,
      }),
    );

    await client.rest.v1.statuses.$select(id).remove();
    await expect(client.rest.v1.statuses.$select(id).fetch()).rejects.toThrow();
  });

  it("creates a status with an Idempotency-Key", async () => {
    await using client = await sessions.acquire();
    const idempotencyKey = crypto.randomUUID();

    const s1 = await client.rest.v1.statuses.create(
      { status: "hello" },
      {
        requestInit: {
          headers: new Headers({ "Idempotency-Key": idempotencyKey }),
        },
      },
    );
    const s2 = await client.rest.v1.statuses.create(
      { status: "hello" },
      {
        requestInit: {
          headers: new Headers({ "Idempotency-Key": idempotencyKey }),
        },
      },
    );

    expect(s1.id).toBe(s2.id);
  });

  it("fetches a status context", async () => {
    await using client = await sessions.acquire();
    const s1 = await client.rest.v1.statuses.create({
      status: "Hello",
    });
    const s2 = await client.rest.v1.statuses.create({
      status: "Hello 2",
      inReplyToId: s1.id,
    });
    const s3 = await client.rest.v1.statuses.create({
      status: "Hello 3",
      inReplyToId: s2.id,
    });

    try {
      const context = await client.rest.v1.statuses
        .$select(s2.id)
        .context.fetch();
      expect(context.ancestors).toContainEqual(s1);
      expect(context.descendants).toContainEqual(s3);
    } finally {
      await client.rest.v1.statuses.$select(s1.id).remove();
      await client.rest.v1.statuses.$select(s2.id).remove();
      await client.rest.v1.statuses.$select(s3.id).remove();
    }
  });

  it("translates a status", async () => {
    await using session = await sessions.acquire();
    const instance = await session.rest.v2.instance.fetch();
    if (!instance.configuration.translation.enabled) {
      return;
    }

    const { id } = await session.rest.v1.statuses.create({
      status: "Hello",
    });

    try {
      const translation = await session.rest.v1.statuses
        .$select(id)
        .translate({ lang: "ja" });
      expect(translation.content).toEqual(expect.any(String));
    } finally {
      await session.rest.v1.statuses.$select(id).remove();
    }
  });

  it("favourites and unfavourites a status", async () => {
    await using alice = await sessions.acquire();
    await using bob = await sessions.acquire();

    const { id: statusId } = await alice.rest.v1.statuses.create({
      status: "status",
    });

    try {
      let status = await bob.rest.v1.statuses.$select(statusId).favourite();
      expect(status.favourited).toBe(true);

      const favourites = await bob.rest.v1.statuses
        .$select(statusId)
        .favouritedBy.list();
      expect(favourites).toContainEqual(bob.account);

      status = await bob.rest.v1.statuses.$select(statusId).unfavourite();
      expect(status.favourited).toBe(false);
    } finally {
      await alice.rest.v1.statuses.$select(statusId).remove();
    }
  });

  it("mutes and unmute a status", async () => {
    await using client = await sessions.acquire();
    let status = await client.rest.v1.statuses.create({
      status: "status",
      visibility: "direct",
    });

    try {
      status = await client.rest.v1.statuses.$select(status.id).mute();
      expect(status.muted).toBe(true);

      status = await client.rest.v1.statuses.$select(status.id).unmute();
      expect(status.muted).toBe(false);
    } finally {
      await client.rest.v1.statuses.$select(status.id).remove();
    }
  });

  it("reblogs and unreblog a status", async () => {
    await using alice = await sessions.acquire();
    await using bob = await sessions.acquire();

    const { id: statusId } = await alice.rest.v1.statuses.create({
      status: "status",
    });

    try {
      let status = await bob.rest.v1.statuses.$select(statusId).reblog();
      expect(status.reblogged).toBe(true);

      const reblogs = await alice.rest.v1.statuses
        .$select(statusId)
        .rebloggedBy.list();
      expect(reblogs).toContainEqual(bob.account);

      status = await bob.rest.v1.statuses.$select(statusId).unreblog();
      expect(status.reblogged).toBe(false);
    } finally {
      await alice.rest.v1.statuses.$select(statusId).remove();
    }
  });

  it("pins and unpin a status", async () => {
    await using client = await sessions.acquire();
    let status = await client.rest.v1.statuses.create({
      status: "status",
      visibility: "private",
    });

    status = await client.rest.v1.statuses.$select(status.id).pin();
    expect(status.pinned).toBe(true);

    status = await client.rest.v1.statuses.$select(status.id).unpin();
    expect(status.pinned).toBe(false);

    await client.rest.v1.statuses.$select(status.id).remove();
  });

  it("bookmarks and unbookmark a status", async () => {
    await using client = await sessions.acquire();
    let status = await client.rest.v1.statuses.create({
      status: "status",
      visibility: "direct",
    });

    status = await client.rest.v1.statuses.$select(status.id).bookmark();
    expect(status.bookmarked).toBe(true);

    status = await client.rest.v1.statuses.$select(status.id).unbookmark();
    expect(status.bookmarked).toBe(false);

    await client.rest.v1.statuses.$select(status.id).remove();
  });

  it("only mentions listed users when allowedMentions is specified", async () => {
    await using alice = await sessions.acquire();
    await using bob = await sessions.acquire();

    const error = await alice.rest.v1.statuses
      .create({
        status: `@${bob.account.acct} hello`,
        allowedMentions: [],
      })
      .then(
        () => {
          throw new Error("Unexpected success");
        },
        (_error) => {
          if (_error instanceof MastoHttpError) return _error;
          throw _error;
        },
      );

    expect(error.additionalProperties).toEqual({
      unexpectedAccounts: [
        expect.objectContaining({
          id: bob.id,
        }),
      ],
    });
  });
});
