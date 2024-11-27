import {
  createRestAPIClient,
  createStreamingAPIClient,
  type mastodon,
} from "../src";

export interface Session {
  readonly id: string;
  readonly account: mastodon.v1.Account;
  readonly rest: mastodon.rest.Client;
  readonly ws: mastodon.streaming.Client;
  readonly [Symbol.asyncDispose]: () => Promise<void>;
}

export const createSession = async (
  token: mastodon.v1.Token,
  url: string,
  streamingApiUrl: string,
  dispose: () => Promise<void>,
): Promise<Session> => {
  const rest = createRestAPIClient({
    url,
    accessToken: token.accessToken,
  });

  const ws = createStreamingAPIClient({
    streamingApiUrl,
    accessToken: token.accessToken,
  });

  const account = await rest.v1.accounts.verifyCredentials();

  return Object.freeze({
    id: account.id,
    account,
    rest,
    ws,
    [Symbol.asyncDispose]: dispose,
  });
};
