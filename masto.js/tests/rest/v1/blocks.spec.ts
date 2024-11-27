describe("blocks", () => {
  it("lists blocks", async () => {
    await using alice = await sessions.acquire();
    await using bob = await sessions.acquire();

    try {
      await alice.rest.v1.accounts.$select(bob.id).block();
      const blocks = await alice.rest.v1.blocks.list();
      expect(blocks).toContainEqual(bob.account);
    } finally {
      await alice.rest.v1.accounts.$select(bob.id).unblock();
    }
  });
});
