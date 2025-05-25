import { type Encoding } from "./serializer";

export interface HttpMetaParams<T extends Encoding = "none"> {
  readonly encoding?: T;
  readonly requestInit?: Omit<RequestInit, "body" | "method">;
}

export type HttpRequestParams = HttpMetaParams<Encoding> & {
  readonly method: string;
  readonly path: string;
  readonly search?: string | Record<string, unknown>;
  readonly body?: Record<string, unknown>;
};

export interface HttpRequestResult {
  headers: Headers;
  data: unknown;
}

export type HttpMethod = <T>(
  path: string,
  data?: unknown,
  meta?: HttpMetaParams<Encoding>,
) => Promise<T>;

export interface Http {
  readonly request: (params: HttpRequestParams) => Promise<HttpRequestResult>;
  readonly get: HttpMethod;
  readonly post: HttpMethod;
  readonly patch: HttpMethod;
  readonly put: HttpMethod;
  readonly delete: HttpMethod;
}
