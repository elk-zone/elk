import { createRestAPIClient } from "masto";

const masto = createRestAPIClient({
  url: "https://example.com",
  accessToken: "TOKEN",
});

// Fetching reports
const reports = await masto.v1.admin.reports.list();

// Disable an account of the 1st report
await masto.v1.admin.accounts.$select(reports[0].account.id).action.create({
  type: "disable",
  reportId: reports[0].id,
  text: "Your account has been disabled",
});
