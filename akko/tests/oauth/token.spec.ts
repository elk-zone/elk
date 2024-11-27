/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createOAuthAPIClient } from "../../src";

it("issues and revokes token", async () => {
  const oauth = createOAuthAPIClient({
    url: globalThis.__misc__.url,
  });

  const token = await oauth.token.create({
    grantType: "password",
    clientId: globalThis.__misc__.app.clientId!,
    clientSecret: globalThis.__misc__.app.clientSecret!,
    username: "admin@localhost",
    password: "mastodonadmin",
    scope: "read",
    redirectUri: "urn:ietf:wg:oauth:2.0:oob",
  });

  expect(token).toHaveProperty("accessToken");

  await oauth.revoke({
    clientId: globalThis.__misc__.app.clientId!,
    clientSecret: globalThis.__misc__.app.clientSecret!,
    token: token.accessToken!,
  });
});
