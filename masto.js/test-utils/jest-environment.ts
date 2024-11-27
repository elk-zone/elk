/* eslint-disable unicorn/prefer-module */
import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";

import Redis from "ioredis";
import NodeEnvironment from "jest-environment-node";

import {
  createOAuthAPIClient,
  createRestAPIClient,
  type mastodon,
} from "../src";
import { TokenFactoryDocker, TokenPoolRedis } from "./pools";
import { createTootctl } from "./tootctl";

class CustomEnvironment extends NodeEnvironment {
  redis!: Redis;

  override async setup(): Promise<void> {
    await super.setup();
    this.redis = new Redis();
    this.global.__misc__ = await this.createGlobals();

    /* eslint-disable @typescript-eslint/no-explicit-any */
    (this.global.Symbol as any).dispose ??= Symbol("Symbol.dispose");
    (this.global.Symbol as any).asyncDispose ??= Symbol("Symbol.asyncDispose");
    /* eslint-enable @typescript-eslint/no-explicit-any */
  }

  override async teardown(): Promise<void> {
    await super.teardown();
    this.redis.disconnect();
  }

  private async createGlobals(): Promise<typeof globalThis.__misc__> {
    const url = "http://localhost:3000";
    const instance = await createRestAPIClient({ url }).v1.instance.fetch();

    const baseCacheDir = path.join(__dirname, "../node_modules/.cache/masto");
    if (!existsSync(baseCacheDir)) {
      throw new Error("Cache directory does not exist");
    }

    const adminToken = await this.readAdminToken(baseCacheDir);
    const container = process.env.MASTODON_CONTAINER ?? "mastodon";
    const tootctl = createTootctl({ container, compose: true });
    const oauth = createOAuthAPIClient({ url });
    const app = await this.readApp(baseCacheDir);
    const factory = new TokenFactoryDocker(tootctl, oauth, app);
    const tokenPool = new TokenPoolRedis(this.redis, factory);

    return {
      url,
      app,
      instance,
      tokens: tokenPool,
      adminToken,
    };
  }

  private readApp = async (
    baseCacheDir: string,
  ): Promise<mastodon.v1.Client> => {
    const appFilePath = path.join(baseCacheDir, "app.json");

    if (!existsSync(appFilePath)) {
      throw new Error("App file does not exist");
    }

    const json = await fs.readFile(appFilePath, "utf8");
    return JSON.parse(json);
  };

  private readAdminToken = async (
    baseCacheDir: string,
  ): Promise<mastodon.v1.Token> => {
    const tokenFilePath = path.join(baseCacheDir, "admin_token.json");

    if (!existsSync(tokenFilePath)) {
      throw new Error("Admin token does not exist");
    }

    const json = await fs.readFile(tokenFilePath, "utf8");
    return JSON.parse(json);
  };
}

export default CustomEnvironment;
