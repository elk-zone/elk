/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable unicorn/prefer-module */

import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";

import {
  createOAuthAPIClient,
  createRestAPIClient,
  type mastodon,
} from "../src";

const readOrCreateApp = async (
  baseCacheDir: string,
  masto: mastodon.rest.Client,
): Promise<mastodon.v1.Client> => {
  const appFilePath = path.join(baseCacheDir, "app.json");

  if (existsSync(appFilePath)) {
    const json = await fs.readFile(appFilePath, "utf8");
    return JSON.parse(json);
  }

  const app = await masto.v1.apps.create({
    clientName: "Masto.js",
    redirectUris: "urn:ietf:wg:oauth:2.0:oob",
    scopes: "read write follow push admin:read admin:write",
  });

  fs.writeFile(appFilePath, JSON.stringify(app, undefined, 2));
  return app;
};

const readOrCreateAdminToken = async (
  baseCacheDir: string,
  oauth: mastodon.oauth.Client,
  app: mastodon.v1.Client,
): Promise<mastodon.v1.Token> => {
  const tokenFilePath = path.join(baseCacheDir, "admin_token.json");

  if (existsSync(tokenFilePath)) {
    const json = await fs.readFile(tokenFilePath, "utf8");
    return JSON.parse(json);
  }

  const token = await oauth.token.create({
    grantType: "password",
    clientId: app.clientId!,
    clientSecret: app.clientSecret!,
    username: "admin@localhost",
    password: "mastodonadmin",
    scope: "read write follow push admin:read admin:write",
    redirectUri: "urn:ietf:wg:oauth:2.0:oob",
  });

  fs.writeFile(tokenFilePath, JSON.stringify(token, undefined, 2));
  return token;
};

export default async function main(): Promise<void> {
  const baseCacheDir = path.join(__dirname, "../node_modules/.cache/masto");
  if (!existsSync(baseCacheDir)) {
    await fs.mkdir(baseCacheDir, { recursive: true });
  }

  const masto = createRestAPIClient({ url: "http://localhost:3000" });
  const oauth = createOAuthAPIClient({ url: "http://localhost:3000" });

  const app = await readOrCreateApp(baseCacheDir, masto);
  await readOrCreateAdminToken(baseCacheDir, oauth, app);
}
