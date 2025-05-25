describe("suggestions", () => {
  it("returns suggestions", async () => {
    await using client = await sessions.acquire();
    const suggestions = await client.rest.v1.suggestions.list();
    expect(suggestions).toEqual(expect.any(Array));
  });

  test.todo("remove suggestion");
});
