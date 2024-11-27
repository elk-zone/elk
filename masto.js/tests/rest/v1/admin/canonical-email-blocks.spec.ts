describe("canonical-email-blocks", () => {
  it("block canonical email address", async () => {
    let canonicalEmailBlock = await admin.v1.admin.canonicalEmailBlocks.create({
      email: "test@example.com",
    });
    try {
      canonicalEmailBlock = await admin.v1.admin.canonicalEmailBlocks
        .$select(canonicalEmailBlock.id)
        .fetch();
      expect(canonicalEmailBlock.canonicalEmailHash).toEqual(
        expect.any(String),
      );

      const result = await admin.v1.admin.canonicalEmailBlocks.test({
        email: "test@example.com",
      });
      expect(result).toContainEqual(canonicalEmailBlock);

      const canonicalEmailBlocks =
        await admin.v1.admin.canonicalEmailBlocks.list();
      expect(canonicalEmailBlocks).toContainEqual(canonicalEmailBlock);
    } finally {
      await admin.v1.admin.canonicalEmailBlocks
        .$select(canonicalEmailBlock.id)
        .remove();
    }
  });
});
