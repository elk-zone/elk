it("handle email domain block", async () => {
  const domain = "example.domain.to.block.com";
  let emailDomainBlock = await admin.v1.admin.emailDomainBlocks.create({
    domain,
  });

  try {
    emailDomainBlock = await admin.v1.admin.emailDomainBlocks
      .$select(emailDomainBlock.id)
      .fetch();
    expect(emailDomainBlock.domain).toMatch(/example.domain.to.block.com/);

    const list = await admin.v1.admin.emailDomainBlocks.list();
    expect(list).toContainEqual(emailDomainBlock);
  } finally {
    await admin.v1.admin.emailDomainBlocks
      .$select(emailDomainBlock.id)
      .remove();
  }
});
