it("block a domain", async () => {
  await using client = await sessions.acquire();
  const domain = "example.domain.to.block.com";

  await client.rest.v1.domainBlocks.create({ domain });
  let domainBlocks = await client.rest.v1.domainBlocks.list();
  expect(domainBlocks).toEqual(expect.arrayContaining([domain]));

  await client.rest.v1.domainBlocks.remove({ domain });
  domainBlocks = await client.rest.v1.domainBlocks.list();
  expect(domainBlocks).not.toEqual(expect.arrayContaining([domain]));
});
