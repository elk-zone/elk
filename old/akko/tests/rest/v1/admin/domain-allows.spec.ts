it("handles domain allows", async () => {
  const domain = "example.domain.to.allow.com";
  let domainAllow = await admin.v1.admin.domainAllows.create({
    domain,
  });

  try {
    domainAllow = await admin.v1.admin.domainAllows
      .$select(domainAllow.id)
      .fetch();
    expect(domainAllow.domain).toMatch(/example.domain.to.allow.com/);

    const list = await admin.v1.admin.domainAllows.list();
    expect(list).toContainEqual(domainAllow);
  } finally {
    await admin.v1.admin.domainAllows.$select(domainAllow.id).remove();
  }
});
