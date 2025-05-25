it("fetches instance", async () => {
  await using session = await sessions.acquire();
  const instance = await session.rest.v2.instance.fetch();
  expect(instance.domain).toEqual(expect.any(String));
});
