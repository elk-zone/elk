import {
  createRestAPIClient,
  createStreamingAPIClient,
  type akkoma,
} from "../src";

export interface Session {
  readonly id: string;
  readonly account: akkoma.v1.Account;
  readonly rest: akkoma.rest.Client;
  readonly ws: akkoma.streaming.Client;
  readonly [Symbol.asyncDispose]: () => Promise<void>;
}

export const createSession = async (
  token: akkoma.v1.Token,
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
