import assert from "node:assert";
import crypto from "node:crypto";

it("maintains connections for the event even if other handlers closed it", async () => {
  const tag = `tag_${crypto.randomBytes(4).toString("hex")}`;
  await using alice = await sessions.acquire({ waitForWs: true });

  using subscription1 = alice.ws.hashtag.subscribe({ tag });
  using subscription2 = alice.ws.hashtag.subscribe({ tag });

  const promise1 = subscription1.values().take(1).toArray();
  const promise2 = subscription2.values().take(2).toArray();

  // Dispatch event for subscription1 to establish connection
  const status1 = await alice.rest.v1.statuses.create({
    status: `#${tag}`,
    visibility: "public",
  });
  await promise1;
  subscription1.unsubscribe();

  // subscription1 is now closed, so status2 will only be dispatched to subscription2
  const status2 = await alice.rest.v1.statuses.create({
    status: `#${tag}`,
    visibility: "public",
  });

  try {
    const [e1, e2] = await promise2;
    assert(e1.event === "update");
    expect(e1.payload.id).toBe(status1.id);

    assert(e2.event === "update");
    expect(e2.payload.id).toBe(status2.id);
  } finally {
    await alice.rest.v1.statuses.$select(status1.id).remove();
    await alice.rest.v1.statuses.$select(status2.id).remove();
  }
});

it("maintains connections for the event if unsubscribe called twice", async () => {
  const tag = `tag_${crypto.randomBytes(4).toString("hex")}`;
  await using alice = await sessions.acquire({ waitForWs: true });

  using subscription1 = alice.ws.hashtag.subscribe({ tag });
  using subscription2 = alice.ws.hashtag.subscribe({ tag });

  const promise1 = subscription1.values().take(1).toArray();
  const promise2 = subscription2.values().take(2).toArray();

  const status1 = await alice.rest.v1.statuses.create({
    status: `#${tag}`,
    visibility: "public",
  });
  await promise1;
  subscription1.unsubscribe();
  subscription1.unsubscribe();
  subscription1.unsubscribe();
  subscription1.unsubscribe();

  const status2 = await alice.rest.v1.statuses.create({
    status: `#${tag}`,
    visibility: "public",
  });

  try {
    const [e1, e2] = await promise2;
    assert(e1.event === "update");
    expect(e1.payload.id).toBe(status1.id);

    assert(e2.event === "update");
    expect(e2.payload.id).toBe(status2.id);
  } finally {
    await alice.rest.v1.statuses.$select(status1.id).remove();
    await alice.rest.v1.statuses.$select(status2.id).remove();
  }
});

it("maintains connections for the event if another handler called unsubscribe before connection established", async () => {
  const tag = `tag_${crypto.randomBytes(4).toString("hex")}`;
  await using alice = await sessions.acquire({ waitForWs: true });

  using subscription1 = alice.ws.hashtag.subscribe({ tag });
  using subscription2 = alice.ws.hashtag.subscribe({ tag });

  subscription1.unsubscribe();

  const promise2 = subscription2.values().take(1).toArray();

  const status1 = await alice.rest.v1.statuses.create({
    status: `#${tag}`,
    visibility: "public",
  });

  try {
    const [e1] = await promise2;
    assert(e1.event === "update");
    expect(e1.payload.id).toBe(status1.id);
  } finally {
    await alice.rest.v1.statuses.$select(status1.id).remove();
  }
});
