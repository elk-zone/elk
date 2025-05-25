import "./jest-polyfills";
import "./jest-extend-expect";

import { createRestAPIClient } from "../src";
import { SessionPoolImpl } from "./pools";

if (process.env.CI) {
  jest.retryTimes(3);
}

jest.setTimeout(1000 * 60);

globalThis.admin = createRestAPIClient({
  url: globalThis.__misc__.url,
  accessToken: globalThis.__misc__.adminToken.accessToken,
});

globalThis.sessions = new SessionPoolImpl(
  globalThis.__misc__.tokens,
  globalThis.__misc__.url,
  globalThis.__misc__.instance,
);
