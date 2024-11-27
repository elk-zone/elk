import { type Redis } from "ioredis";

import { type mastodon } from "../../src";
import { type TokenFactory } from "./token-factory";
import { type TokenPool } from "./token-pool";

export interface Entry {
  readonly token: mastodon.v1.Token;
  readonly inUse: boolean;
}

export class TokenPoolRedis implements TokenPool {
  constructor(
    private readonly redis: Redis,
    private readonly tokenFactory: TokenFactory,
  ) {}

  async acquire(): Promise<mastodon.v1.Token> {
    const keys = await this.redis.keys("token:*");

    for (const key of keys) {
      await this.redis.watch(key);
      const entry = await this.redis.get(key);

      if (entry == undefined) {
        await this.redis.unwatch();
        continue;
      }

      const parsed = JSON.parse(entry) as Entry;
      if (parsed.inUse) {
        await this.redis.unwatch();
        continue;
      }

      try {
        await this.redis.set(key, JSON.stringify({ ...parsed, inUse: true }));
        return parsed.token;
      } finally {
        await this.redis.unwatch();
      }
    }

    const token = await this.tokenFactory.obtain();
    const key = `token:${token.accessToken}`;
    await this.redis.set(key, JSON.stringify({ token, inUse: true }));
    return token;
  }

  async release(token: mastodon.v1.Token): Promise<void> {
    const key = `token:${token.accessToken}`;
    const entry = await this.redis.get(key);

    if (entry == undefined) {
      throw new Error(`Token ${token.accessToken} not found`);
    }

    const parsed = JSON.parse(entry);
    await this.redis.set(key, JSON.stringify({ ...parsed, inUse: false }));
  }
}
