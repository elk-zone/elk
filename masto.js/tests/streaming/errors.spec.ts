/* eslint-disable unicorn/no-array-callback-reference */
import { type mastodon } from "../../src";
import { MastoUnexpectedError } from "../../src/adapters/errors";
import { sleep } from "../../src/utils";

const isUpdate = (
  s: mastodon.streaming.Event,
): s is mastodon.streaming.UpdateEvent => {
  return s.event === "update";
};

const isFrom = (id: string) => (s: mastodon.streaming.UpdateEvent) => {
  return s.payload.account.id === id;
};

it("throws an error when user tried to subscribe hashtag without the name", async () => {
  await using alice = await sessions.acquire();
  const subscription = alice.ws.hashtag.subscribe({ tag: "" });

  await expect(() => subscription.values().toArray()).rejects.toThrow(
    MastoUnexpectedError,
  );
});

it("supports multiplex subscription", async () => {
  await using alice = await sessions.acquire();
  using s3 = alice.ws.public.subscribe();
  using s2 = alice.ws.public.local.subscribe();
  using s1 = alice.ws.hashtag.subscribe({ tag: "test" });

  const e1Promise = s1
    .values()
    .filter(isUpdate)
    .filter(isFrom(alice.id))
    .take(1)
    .toArray();
  const e2Promise = s2
    .values()
    .filter(isUpdate)
    .filter(isFrom(alice.id))
    .take(1)
    .toArray();
  const e3Promise = s3
    .values()
    .filter(isUpdate)
    .filter(isFrom(alice.id))
    .take(1)
    .toArray();

  await sleep(1000);

  const status = await alice.rest.v1.statuses.create({
    status: "#test",
    visibility: "public",
  });

  try {
    const [[e1], [e2], [e3]] = await Promise.all([
      e1Promise,
      e2Promise,
      e3Promise,
    ]);

    expect(e1.payload.id).toBe(status.id);
    expect(e2.payload.id).toBe(status.id);
    expect(e3.payload.id).toBe(status.id);
  } finally {
    await alice.rest.v1.statuses.$select(status.id).remove();
  }
});
