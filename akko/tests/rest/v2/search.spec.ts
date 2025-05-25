it("searches", async () => {
  await using session = await sessions.acquire();
  const results = await session.rest.v2.search.list({
    q: "mastodon",
  });

  expect(results).toMatchObject({
    accounts: expect.any(Array),
    statuses: expect.any(Array),
    hashtags: expect.any(Array),
  });
});

it("can be iterated over", async () => {
  await using session = await sessions.acquire();
  const results = session.rest.v2.search.list({
    q: "mastodon",
  });

  const p1 = await results.next();

  expect(typeof p1.done).toBe("boolean");
  expect(p1.value).toMatchObject({
    accounts: expect.any(Array),
    statuses: expect.any(Array),
    hashtags: expect.any(Array),
  });
});
