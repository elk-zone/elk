describe("trend", () => {
  it("returns trend statuses", async () => {
    await using client = await sessions.acquire();
    const statuses = await client.rest.v1.trends.statuses.list();
    expect(statuses).toEqual(expect.any(Array));
  });

  it("returns trend links", async () => {
    await using client = await sessions.acquire();
    const statuses = await client.rest.v1.trends.links.list();
    expect(statuses).toEqual(expect.any(Array));
  });

  it("returns trend tags", async () => {
    await using client = await sessions.acquire();
    const statuses = await client.rest.v1.trends.tags.list();
    expect(statuses).toEqual(expect.any(Array));
  });
});
