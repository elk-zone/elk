it("fetches measures", async () => {
  const measure = await admin.v1.admin.measures.create({
    keys: ["active_users"],
    startAt: new Date("2019-01-01").toISOString(),
    endAt: new Date("2019-01-02").toISOString(),
  });

  expect(measure).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        key: "active_users",
      }),
    ]),
  );
});
