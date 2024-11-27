import crypto from "node:crypto";

import { type mastodon } from "../../src";
import { sleep } from "../../src/utils";
import { type Tootctl } from "../tootctl";
import { type TokenFactory } from "./token-factory";

export class TokenFactoryDocker implements TokenFactory {
  private opened = false;

  constructor(
    private readonly tootctl: Tootctl,
    private readonly oauth: mastodon.oauth.Client,
    private readonly app: mastodon.v1.Client,
  ) {}

  async obtain(): Promise<mastodon.v1.Token> {
    if (!this.opened) {
      await this.tootctl.settings.registrations.open();
      await sleep(5000);
      this.opened = true;
    }

    const username = crypto.randomBytes(8).toString("hex");
    const email = crypto.randomBytes(8).toString("hex") + "@example.com";

    // eslint-disable-next-line no-console
    console.log(`Creating user ${username} (${email})`);

    const { password } = await this.tootctl.accounts.create(username, {
      email,
      confirmed: true,
    });

    // Wait for the new account to be available
    await sleep(5000);

    if (this.app.clientId == undefined || this.app.clientSecret == undefined) {
      throw new Error("App not created");
    }

    const token = await this.oauth.token.create({
      grantType: "password",
      clientId: this.app.clientId,
      clientSecret: this.app.clientSecret,
      username: email,
      password,
      scope: "read write follow push admin:read admin:write",
      redirectUri: "urn:ietf:wg:oauth:2.0:oob",
    });

    return token;
  }
}
