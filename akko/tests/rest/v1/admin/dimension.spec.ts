it("fetches dimension", async () => {
  const dimension = await admin.v1.admin.dimensions.create({
    keys: ["languages", "sources"],
  });
  expect(dimension).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        key: "languages",
      }),
      expect.objectContaining({
        key: "sources",
      }),
    ]),
  );
});
