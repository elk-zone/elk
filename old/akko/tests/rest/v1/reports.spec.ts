import assert from "node:assert";

it("creates a report", async () => {
  await using alice = await sessions.acquire();
  await using bob = await sessions.acquire();

  await alice.rest.v1.reports.create({ accountId: bob.id });
  const reports = await admin.v1.admin.reports.list();
  const report = reports.find((report) => report.targetAccount.id === bob.id);

  assert(report != undefined);
  expect(report).toBeDefined();
  await admin.v1.admin.reports.$select(report.id).resolve();
});
