/* eslint-disable no-var */
import { type mastodon } from "../src";
import { type SessionPoolImpl, type TokenPool } from "./pools";

declare global {
  var admin: mastodon.rest.Client;
  var sessions: SessionPoolImpl;

  var __misc__: {
    url: string;
    tokens: TokenPool;
    app: mastodon.v1.Client;
    instance: mastodon.v1.Instance;
    adminToken: mastodon.v1.Token;
  };
}
