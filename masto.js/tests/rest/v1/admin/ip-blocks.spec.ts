it("handles ip blocks", async () => {
  let ipBlock = await admin.v1.admin.ipBlocks.create({
    ip: "65.10.51.60",
    severity: "no_access",
  });

  try {
    ipBlock = await admin.v1.admin.ipBlocks.$select(ipBlock.id).fetch();
    expect(ipBlock.ip).toBe("65.10.51.60/32");

    ipBlock = await admin.v1.admin.ipBlocks.$select(ipBlock.id).update({
      severity: "sign_up_requires_approval",
    });
    expect(ipBlock.severity).toBe("sign_up_requires_approval");

    const list = await admin.v1.admin.ipBlocks.list();
    expect(list).toContainEqual(ipBlock);
  } finally {
    await admin.v1.admin.ipBlocks.$select(ipBlock.id).remove();
  }
});
