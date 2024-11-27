it("lists directory", async () => {
  await using client = await sessions.acquire();
  const directory = await client.rest.v1.directory.list();
  expect(directory).toEqual(expect.any(Array));
});
