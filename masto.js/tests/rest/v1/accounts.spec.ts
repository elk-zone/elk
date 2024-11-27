import assert from "node:assert";
import crypto from "node:crypto";

import { MastoHttpError } from "../../../src/adapters/errors";
import { sleep } from "../../../src/utils";

describe("account", () => {
  it("creates an account", async () => {
    await using session = await sessions.acquire();
    const username = crypto.randomBytes(8).toString("hex");
    const email = `${username}@example.com`;

    const token = await session.rest.v1.accounts.create({
      username,
      email,
      password: "password",
      agreement: true,
      locale: "en",
    });

    expect(token.accessToken).toEqual(expect.any(String));
  });

  it("throws an error if registration is malformed", async () => {
    await using session = await sessions.acquire();
    const error = await session.rest.v1.accounts
      .create({
        username: "",
        email: "",
        password: "",
        agreement: false,
        locale: "hello",
      })
      .then(
        () => {
          throw new Error("should not be called");
        },
        (error) => error,
      );

    assert(error instanceof MastoHttpError);
    expect(error.statusCode).toBe(422);
    expect(error.details).toEqual({
      agreement: [
        {
          description: "must be accepted",
          error: "ERR_ACCEPTED",
        },
      ],
      email: [
        {
          description: "can't be blank",
          error: "ERR_BLANK",
        },
        {
          description: "is invalid",
          error: "ERR_INVALID",
        },
      ],
      // locale: [
      //   {
      //     description: "is not included in the list",
      //     error: "ERR_INCLUSION",
      //   },
      // ],
      password: [
        {
          description: "can't be blank",
          error: "ERR_BLANK",
        },
      ],
      username: [
        {
          description: "can't be blank",
          error: "ERR_BLANK",
        },
      ],
    });
  });

  it("verifies credential", async () => {
    await using session = await sessions.acquire();
    const me = await session.rest.v1.accounts.verifyCredentials();
    expect(me.username).not.toBeNull();
  });

  it("updates credential", async () => {
    await using session = await sessions.acquire();
    const random = Math.random().toString();
    const me = await session.rest.v1.accounts.updateCredentials({
      displayName: random,
    });
    expect(me.displayName).toBe(random);
  });

  it("updates field", async () => {
    await using session = await sessions.acquire();
    const random = Math.random().toString();
    const me = await session.rest.v1.accounts.updateCredentials({
      fieldsAttributes: [
        {
          name: "test",
          value: random,
        },
      ],
    });

    expect(me.fields).toEqual([
      {
        name: "test",
        value: random,
        // eslint-disable-next-line unicorn/no-null
        verifiedAt: null,
      },
    ]);

    await session.rest.v1.accounts.updateCredentials({
      fieldsAttributes: undefined,
    });
  });

  it("fetches an account with ID", async () => {
    await using session = await sessions.acquire();
    const someone = await admin.v1.accounts.$select(session.id).fetch();
    expect(session.id).toBe(someone.id);
  });

  it("follows / unfollow by ID", async () => {
    await using alice = await sessions.acquire();
    await using bob = await sessions.acquire();

    let relationship = await alice.rest.v1.accounts.$select(bob.id).follow();
    expect(relationship.following).toBe(true);

    relationship = await alice.rest.v1.accounts.$select(bob.id).unfollow();
    expect(relationship.following).toBe(false);
  });

  it("blocks / unblock by ID", async () => {
    await using alice = await sessions.acquire();
    await using bob = await sessions.acquire();

    let relationship = await alice.rest.v1.accounts.$select(bob.id).block();
    expect(relationship.blocking).toBe(true);

    relationship = await alice.rest.v1.accounts.$select(bob.id).unblock();
    expect(relationship.blocking).toBe(false);
  });

  it("can pin / unpin by ID", async () => {
    await using alice = await sessions.acquire();
    await using bob = await sessions.acquire();

    await alice.rest.v1.accounts.$select(bob.id).follow();
    let relationship = await alice.rest.v1.accounts.$select(bob.id).pin();
    expect(relationship.endorsed).toBe(true);

    relationship = await alice.rest.v1.accounts.$select(bob.id).unpin();
    await alice.rest.v1.accounts.$select(bob.id).unfollow();
    expect(relationship.endorsed).toBe(false);
  });

  it("mutes / unmute by ID", async () => {
    await using alice = await sessions.acquire();
    await using bob = await sessions.acquire();

    let relationship = await alice.rest.v1.accounts.$select(bob.id).mute();
    expect(relationship.muting).toBe(true);

    relationship = await alice.rest.v1.accounts.$select(bob.id).unmute();
    expect(relationship.muting).toBe(false);
  });

  it("mutes by ID for 1s", async () => {
    await using alice = await sessions.acquire();
    await using bob = await sessions.acquire();

    let relationship = await alice.rest.v1.accounts
      .$select(bob.id)
      .mute({ duration: 1 });
    expect(relationship.muting).toBe(true);

    await sleep(5000);

    [relationship] = await alice.rest.v1.accounts.relationships.fetch({
      id: [bob.id],
    });
    expect(relationship.muting).toBe(false);
  });

  it("creates a note", async () => {
    await using alice = await sessions.acquire();
    await using bob = await sessions.acquire();

    const comment = Math.random().toString();
    const relationship = await alice.rest.v1.accounts
      .$select(bob.id)
      .note.create({ comment });

    expect(relationship.note).toBe(comment);
  });

  it("fetches relationships", async () => {
    await using alice = await sessions.acquire();
    await using bob = await sessions.acquire();
    await using carol = await sessions.acquire();

    const res = await alice.rest.v1.accounts.relationships.fetch({
      id: [bob.id, carol.id],
    });
    expect(res).toHaveLength(2);
  });

  it("lists followers", async () => {
    await using alice = await sessions.acquire();
    await using bob = await sessions.acquire();

    await alice.rest.v1.accounts.$select(bob.id).follow();
    const followers = await alice.rest.v1.accounts
      .$select(bob.id)
      .followers.list();

    expect(followers).toContainEqual(alice.account);
    await alice.rest.v1.accounts.$select(bob.id).unfollow();
  });

  it("lists following", async () => {
    await using alice = await sessions.acquire();
    await using bob = await sessions.acquire();

    await alice.rest.v1.accounts.$select(bob.id).follow();
    const accounts = await alice.rest.v1.accounts
      .$select(alice.id)
      .following.list();

    expect(accounts).toContainEqual(bob.account);
    await alice.rest.v1.accounts.$select(bob.id).unfollow();
  });

  it("lists statuses", async () => {
    await using client = await sessions.acquire();
    const status = await client.rest.v1.statuses.create({ status: "Hello" });
    const statuses = await client.rest.v1.accounts
      .$select(status.account.id)
      .statuses.list();

    expect(statuses).toContainEqual(status);
  });

  it("searches", async () => {
    await using client = await sessions.acquire();
    const me = await client.rest.v1.accounts.verifyCredentials();
    const accounts = await client.rest.v1.accounts.search.list({
      q: me.username,
    });
    expect(accounts).toContainEqual(me);
  });

  it("lists lists", async () => {
    await using alice = await sessions.acquire();
    await using bob = await sessions.acquire();
    const list = await alice.rest.v1.lists.create({ title: "title" });
    await alice.rest.v1.accounts.$select(bob.id).follow();

    try {
      await alice.rest.v1.lists.$select(list.id).accounts.create({
        accountIds: [bob.id],
      });
      const lists = await alice.rest.v1.accounts.$select(bob.id).lists.list();
      expect(lists).toContainEqual(list);
    } finally {
      await alice.rest.v1.lists.$select(list.id).remove();
    }
  });

  it("lists featured tags", async () => {
    await using client = await sessions.acquire();
    const featuredTag = await client.rest.v1.featuredTags.create({
      name: "mastodon",
    });

    const tags = await client.rest.v1.accounts
      .$select(client.id)
      .featuredTags.list();
    expect(tags).toContainEqual(featuredTag);

    await client.rest.v1.featuredTags.$select(featuredTag.id).remove();
  });

  it("lists Identity proofs", async () => {
    await using client = await sessions.acquire();
    const identityProofs = await client.rest.v1.accounts
      .$select(client.id)
      .identityProofs.list();

    expect(identityProofs).toEqual(expect.any(Array));
  });

  it("fetches familiar followers", async () => {
    await using client = await sessions.acquire();
    const identityProofs =
      await client.rest.v1.accounts.familiarFollowers.fetch([client.id]);
    expect(identityProofs).toEqual(expect.any(Array));
  });

  it("lookup", async () => {
    await using client = await sessions.acquire();
    const account = await client.rest.v1.accounts.lookup({
      acct: client.account.acct,
    });
    expect(account.id).toBe(client.id);
  });

  it("removes from followers", async () => {
    await using alice = await sessions.acquire();
    await using bob = await sessions.acquire();
    await bob.rest.v1.accounts.$select(alice.id).follow();
    await alice.rest.v1.accounts.$select(bob.id).removeFromFollowers();
    const [rel] = await alice.rest.v1.accounts.relationships.fetch({
      id: [bob.id],
    });
    expect(rel.followedBy).toBe(false);
  });
});
