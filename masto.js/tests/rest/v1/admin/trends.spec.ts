describe("trends", () => {
  it("fetches links", async () => {
    const links = await admin.v1.admin.trends.links.list();
    expect(links).toEqual(expect.any(Array));
  });

  it("fetches link publishers", async () => {
    const links = await admin.v1.admin.trends.links.publishers.list();
    expect(links).toEqual(expect.any(Array));
  });

  it("fetches statuses", async () => {
    const statuses = await admin.v1.admin.trends.statuses.list();
    expect(statuses).toEqual(expect.any(Array));
  });

  it("fetches tags", async () => {
    const tags = await admin.v1.admin.trends.tags.list();
    expect(tags).toEqual(expect.any(Array));
  });

  test.todo("approve a tag");
  test.todo("reject a tag");

  test.todo("approve a link");
  test.todo("reject a link");

  test.todo("approve a status");
  test.todo("reject a status");

  test.todo("approve a link publisher");
  test.todo("reject a link publisher");
});
