import crypto from "node:crypto";

import { createRestAPIClient } from "../../../src";

it("can create a confirmation", async () => {
  const username = crypto.randomBytes(8).toString("hex");
  let email = `${username}@example.com`;

  const token = await admin.v1.accounts.create({
    username,
    email,
    password: "password",
    agreement: true,
    locale: "en",
  });

  const client = createRestAPIClient({
    url: __misc__.url,
    accessToken: token.accessToken,
  });

  email = `${username}@example2.com`;
  await client.v1.emails.confirmations.create({ email });
});
