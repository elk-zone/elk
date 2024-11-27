/* eslint-disable no-var */
import { type akkoma } from "../src";
import { type SessionPoolImpl, type TokenPool } from "./pools";

declare global {
  var admin: akkoma.rest.Client;
  var sessions: SessionPoolImpl;

  var __misc__: {
    url: string;
    tokens: TokenPool;
    app: akkoma.v1.Client;
    instance: akkoma.v1.Instance;
    adminToken: akkoma.v1.Token;
  };
}
