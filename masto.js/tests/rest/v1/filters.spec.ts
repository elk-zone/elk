it("lists filters", async () => {
  await using client = await sessions.acquire();
  let filter = await client.rest.v1.filters.create({
    phrase: "test1",
    context: ["home"],
  });

  try {
    await client.rest.v1.filters.$select(filter.id).update({
      phrase: "test1",
      context: ["home", "notifications"],
    });

    filter = await client.rest.v1.filters.$select(filter.id).fetch();
    expect(filter.phrase).toBe("test1");
    expect(filter.context).toEqual(["home", "notifications"]);

    const filters = await client.rest.v1.filters.list();
    expect(filters).toContainEqual(filter);
  } finally {
    await client.rest.v1.filters.$select(filter.id).remove();
  }
});
