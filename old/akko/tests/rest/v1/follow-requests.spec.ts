import waitForExpect from "@sadams/wait-for-expect";

it("authorize follow requests", async () => {
  await using alice = await sessions.acquire();
  await using bob = await sessions.acquire();
  await alice.rest.v1.accounts.updateCredentials({ locked: true });

  await waitForExpect(async () => {
    const me = await alice.rest.v1.accounts.verifyCredentials();
    expect(me.locked).toBe(true);
  });

  try {
    let relationship = await bob.rest.v1.accounts.$select(alice.id).follow();
    expect(relationship.requested).toBe(true);

    const followRequests = await alice.rest.v1.followRequests.list();
    expect(followRequests).toContainEqual(bob.account);

    await alice.rest.v1.followRequests.$select(bob.id).authorize();
    [relationship] = await bob.rest.v1.accounts.relationships.fetch({
      id: [alice.id],
    });
    expect(relationship.following).toBe(true);
  } finally {
    await alice.rest.v1.accounts.updateCredentials({ locked: false });
    await bob.rest.v1.accounts.$select(alice.id).unfollow();
  }
});

it("rejects follow requests", async () => {
  await using alice = await sessions.acquire();
  await using bob = await sessions.acquire();
  await alice.rest.v1.accounts.updateCredentials({ locked: true });

  await waitForExpect(async () => {
    const target = await bob.rest.v1.accounts.$select(alice.id).fetch();
    expect(target.locked).toBe(true);
  });

  try {
    let relationship = await bob.rest.v1.accounts.$select(alice.id).follow();
    expect(relationship.requested).toBe(true);

    const followRequests = await alice.rest.v1.followRequests.list();
    expect(followRequests).toContainEqual(bob.account);

    await alice.rest.v1.followRequests.$select(bob.id).reject();
    [relationship] = await bob.rest.v1.accounts.relationships.fetch({
      id: [alice.id],
    });
    expect(relationship.following).toBe(false);
  } finally {
    await alice.rest.v1.accounts.updateCredentials({ locked: false });
  }
});
