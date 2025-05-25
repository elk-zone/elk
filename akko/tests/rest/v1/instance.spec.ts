it("lists peers", async () => {
  await using client = await sessions.acquire();
  const peers = await client.rest.v1.instance.peers.list();
  expect(peers).toEqual(expect.any(Array));
});

it("lists peers", async () => {
  await using client = await sessions.acquire();
  const peers = await client.rest.v1.instance.activity.list();
  expect(peers).toEqual(expect.any(Array));
});

it("lists languages", async () => {
  await using client = await sessions.acquire();
  const languages = await client.rest.v1.instance.languages.list();
  expect(languages).toEqual(expect.any(Array));
});

it("lists translatable languages", async () => {
  await using client = await sessions.acquire();
  const languages = await client.rest.v1.instance.translationLanguages.list();
  expect(languages).toEqual(expect.any(Object));
});

it("fetches extended description", async () => {
  await using client = await sessions.acquire();
  const description = await client.rest.v1.instance.extendedDescription.fetch();

  expect(description).toEqual({
    content: "",
    // eslint-disable-next-line unicorn/no-null
    updatedAt: null,
  });
});

test.todo("lists domain blocks");
// FIXME: domain blocks publicity setting can only be edited via the admin panel
// it("lists domain blocks", async () => {
//   await using client = await sessions.acquire();
//   const blocks = await client.rest.v1.instance.domainBlocks.fetch();
//   expect(blocks).toEqual([]);
// });
