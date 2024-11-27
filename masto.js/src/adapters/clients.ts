import { type LogType } from "../interfaces";
import { type mastodon } from "../mastodon";
import {
  createActionProxy,
  HttpActionDispatcher,
  WebSocketActionDispatcher,
} from "./action";
import { HttpActionDispatcherHookMastodon } from "./action/dispatcher-http-hook-mastodon";
import {
  HttpConfigImpl,
  type MastoHttpConfigProps,
  WebSocketConfigImpl,
  type WebSocketConfigProps,
} from "./config";
import { HttpNativeImpl } from "./http";
import { createLogger } from "./logger";
import { SerializerNativeImpl } from "./serializers";
import { WebSocketConnectorImpl, WebSocketSubscriptionCounterImpl } from "./ws";

interface LogConfigProps {
  /**
   * Log level for the client.
   *
   * - `debug`: Log everything.
   * - `info`: Log important information.
   * - `warn`: Log warnings.
   * - `error`: Log errors.
   *
   * Defaults to `warn`.
   */
  readonly log?: LogType;
}

export const createRestAPIClient = (
  props: MastoHttpConfigProps & LogConfigProps,
): mastodon.rest.Client => {
  const serializer = new SerializerNativeImpl();
  const config = new HttpConfigImpl(props, serializer);
  const logger = createLogger(props.log);
  const http = new HttpNativeImpl(serializer, config, logger);
  const hook = new HttpActionDispatcherHookMastodon(http);
  const actionDispatcher = new HttpActionDispatcher(http, hook);
  const actionProxy = createActionProxy(actionDispatcher, {
    context: ["api"],
  }) as mastodon.rest.Client;
  return actionProxy;
};

export const createOAuthAPIClient = (
  props: MastoHttpConfigProps & LogConfigProps,
): mastodon.oauth.Client => {
  const serializer = new SerializerNativeImpl();
  const config = new HttpConfigImpl(props, serializer);
  const logger = createLogger(props.log);
  const http = new HttpNativeImpl(serializer, config, logger);
  const hook = new HttpActionDispatcherHookMastodon(http);
  const actionDispatcher = new HttpActionDispatcher(http, hook);
  const actionProxy = createActionProxy(actionDispatcher, {
    context: ["oauth"],
  }) as mastodon.oauth.Client;
  return actionProxy;
};

interface WebSocketCustomImplProps {
  /**
   * Custom WebSocket implementation. In Deno, you can use `WebSocket` to avoid potential errors.
   *
   * Defaults to `window.WebSocket`.
   */
  readonly implementation?: unknown;
}

export function createStreamingAPIClient(
  props: WebSocketConfigProps & LogConfigProps & WebSocketCustomImplProps,
): mastodon.streaming.Client {
  const serializer = new SerializerNativeImpl();
  const config = new WebSocketConfigImpl(props, serializer);
  const logger = createLogger(props.log);
  const connector = new WebSocketConnectorImpl(
    {
      constructorParameters: [
        config.resolvePath("/api/v1/streaming"),
        config.getProtocols(),
      ],
      implementation: props.implementation,
      maxAttempts: config.getMaxAttempts(),
    },
    logger,
  );
  const counter = new WebSocketSubscriptionCounterImpl();
  const actionDispatcher = new WebSocketActionDispatcher(
    connector,
    counter,
    serializer,
    logger,
  );

  const actionProxy = createActionProxy(actionDispatcher);
  return actionProxy as mastodon.streaming.Client;
}
