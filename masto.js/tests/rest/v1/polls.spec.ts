import assert from "node:assert";

it("handles poll", async () => {
  await using alice = await sessions.acquire();
  await using bob = await sessions.acquire();

  const status = await alice.rest.v1.statuses.create({
    status: `Which fruits do you like?`,
    poll: {
      options: ["Apple", "Banana", "Orange"],
      multiple: true,
      expiresIn: 60 * 60 * 24,
    },
  });

  try {
    assert(status.poll != undefined);
    await bob.rest.v1.polls.$select(status.poll.id).votes.create({
      choices: [0, 1],
    });
    const poll = await bob.rest.v1.polls.$select(status.poll.id).fetch();
    expect(poll.votesCount).toBe(2);
    expect(poll.ownVotes).toEqual([0, 1]);
  } finally {
    await alice.rest.v1.statuses.$select(status.id).remove();
  }
});
