import { type Serializer, type WebSocketConfig } from "../../interfaces";

export interface WebSocketConfigProps {
  /**
   * Streaming API URL for your Mastodon instance.
   *
   * Note that this is often different from the REST API URL.
   *
   * If you are not sure which URL to use, you can obtain it via the following script:
   *
   * @example
   * ```ts
   * import { createRestAPIClient, createStreamingAPIClient } from "masto";
   *
   * const rest = createRestAPIClient({
   *   url: "https://example.com",
   * });
   *
   * const instance = await rest.v2.instance.fetch();
   *
   * const streaming = createStreamingAPIClient({
   *  streamingApiUrl: instance.configuration.urls.streaming,
   * })
   * ```
   */
  readonly streamingApiUrl: string;

  /**
   * Access token for the streaming API.
   *
   * If it is not provided, you won't be able to use private APIs.
   */
  readonly accessToken?: string;

  /**
   * Whether to retry the connection when it fails.
   *
   * - If `true`, it will retry indefinitely.
   * - If `false`, it will not retry.
   * - If a number, it will retry that many times.
   *
   * Defaults to `true`.
   */
  readonly retry?: boolean | number;

  /**
   * Whether to use the access token as a query parameter.
   *
   * This is useful when your instance runs an old version of Mastodon that does not support the `Sec-Websocket-Protocols`
   *
   * Defaults to `false`.
   */
  readonly useInsecureAccessToken?: boolean;
}

export class WebSocketConfigImpl implements WebSocketConfig {
  constructor(
    private readonly props: WebSocketConfigProps,
    private readonly serializer: Serializer,
  ) {}

  getProtocols(protocols: readonly string[] = []): string[] {
    if (
      this.props.useInsecureAccessToken ||
      this.props.accessToken == undefined
    ) {
      return [...protocols];
    }

    return [this.props.accessToken, ...protocols];
  }

  resolvePath(path: string, params: Record<string, unknown> = {}): URL {
    const url = new URL(path, this.props.streamingApiUrl);
    if (this.props.useInsecureAccessToken) {
      params.accessToken = this.props.accessToken;
    }

    url.search = this.serializer.serialize("querystring", params);
    return url;
  }

  getMaxAttempts(): number {
    if (this.props.retry === true || this.props.retry == undefined) {
      return Number.POSITIVE_INFINITY;
    }

    if (this.props.retry === false) {
      return 1;
    }

    return this.props.retry;
  }
}
