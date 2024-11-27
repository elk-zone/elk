describe("bookmarks", () => {
  it("lists bookmarks", async () => {
    await using client = await sessions.acquire();
    const status = await client.rest.v1.statuses.create({ status: "status" });

    try {
      await client.rest.v1.statuses.$select(status.id).bookmark();
      const bookmarks = await client.rest.v1.bookmarks.list();
      expect(bookmarks).toContainEqual(status);
    } finally {
      await client.rest.v1.statuses.$select(status.id).unbookmark();
    }
  });
});
