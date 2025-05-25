import {
  type Http,
  type HttpConfig,
  type HttpRequestParams,
  type HttpRequestResult,
  type Logger,
  type Serializer,
} from "../../interfaces";
import {
  MastoHttpError,
  type MastoHttpErrorDetails,
  MastoTimeoutError,
  MastoUnexpectedError,
} from "../errors";
import { BaseHttp } from "./base-http";
import { getEncoding } from "./get-encoding";

export class HttpNativeImpl extends BaseHttp implements Http {
  constructor(
    private readonly serializer: Serializer,
    private readonly config: HttpConfig,
    private readonly logger?: Logger,
  ) {
    super();
  }

  async request(params: HttpRequestParams): Promise<HttpRequestResult> {
    const request = this.createRequest(params);

    try {
      this.logger?.log("info", `↑ ${request.method} ${request.url}`);
      this.logger?.log("debug", "\tbody", {
        encoding: params.encoding,
        body: params.body,
      });
      const response = await fetch(request);
      if (!response.ok) {
        throw response;
      }

      const text = await response.text();
      const encoding = getEncoding(response.headers);
      if (!encoding) {
        throw new MastoUnexpectedError(
          "The server returned data with an unknown encoding.",
        );
      }

      const data = this.serializer.deserialize(encoding, text);
      this.logger?.log("info", `↓ ${request.method} ${request.url}`);
      this.logger?.log("debug", "\tbody", text);

      return {
        headers: response.headers,
        data,
      };
    } catch (error) {
      this.logger?.log("debug", `HTTP failed`, error);
      throw await this.createError(error);
    }
  }

  private createRequest(params: HttpRequestParams): Request {
    const {
      method,
      path,
      search,
      encoding = "json",
      requestInit = {},
    } = params;

    const url = this.config.resolvePath(path, search);
    const body = this.serializer.serialize(encoding, params.body);
    const init = this.config.mergeRequestInitWithDefaults(requestInit);

    const request = new Request(url, {
      method,
      body,
      ...init,
    });

    if (typeof body === "string" && encoding === "json") {
      request.headers.set("Content-Type", "application/json");
    }

    return request;
  }

  private async createError(error: unknown): Promise<unknown> {
    if (error instanceof Response) {
      const encoding = getEncoding(error.headers);
      if (!encoding) {
        throw new MastoUnexpectedError(
          "The server returned data with an unknown encoding. The server may be down.",
        );
      }

      const data = this.serializer.deserialize(encoding, await error.text());
      const {
        error: message,
        errorDescription,
        details,
        ...additionalProperties
      } = data;

      return new MastoHttpError(
        {
          statusCode: error.status,
          message: message as string,
          description: errorDescription as string,
          details: details as MastoHttpErrorDetails,
          additionalProperties,
        },
        { cause: error },
      );
    }

    // TODO: Remove this handling when `AbortSignal.any` is shipped
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (error != undefined && (error as any).name === "TimeoutError") {
      return new MastoTimeoutError(`Request timed out`, { cause: error });
    }

    /* istanbul ignore next */
    return error;
  }
}
