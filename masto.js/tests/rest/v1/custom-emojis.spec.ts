describe("custom emojis", () => {
  it("lists custom emojis", async () => {
    await using client = await sessions.acquire();
    const emojis = await client.rest.v1.customEmojis.list();
    expect(emojis).toEqual(expect.any(Array));
  });
});
