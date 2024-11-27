it("fetches retention", async () => {
  const cohort = await admin.v1.admin.retention.create({
    startAt: new Date("2023-04-07").toISOString(),
    endAt: new Date("2023-04-08").toISOString(),
    frequency: "day",
  });
  expect(cohort).toEqual(expect.any(Array));
});
