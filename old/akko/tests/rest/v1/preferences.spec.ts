it("shows preferences", async () => {
  await using client = await sessions.acquire();
  const preferences = await client.rest.v1.preferences.fetch();

  expect(preferences["posting:default:language"]).toBeDefined();
  expect(preferences["posting:default:sensitive"]).toBeDefined();
});
