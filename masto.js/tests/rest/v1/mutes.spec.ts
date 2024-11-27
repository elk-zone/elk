it("lists mute", async () => {
  await using alice = await sessions.acquire();
  await using bob = await sessions.acquire();
  await alice.rest.v1.accounts.$select(bob.id).mute();

  try {
    const mutes = await alice.rest.v1.mutes.list();
    expect(mutes).toContainEqual(bob.account);
  } finally {
    await alice.rest.v1.accounts.$select(bob.id).unmute();
  }
});
