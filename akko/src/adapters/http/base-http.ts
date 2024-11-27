import {
  type Encoding,
  type Http,
  type HttpMetaParams,
  type HttpRequestParams,
  type HttpRequestResult,
} from "../../interfaces";

export abstract class BaseHttp implements Http {
  abstract request(params: HttpRequestParams): Promise<HttpRequestResult>;

  get<T>(
    path: string,
    data?: unknown,
    meta: HttpMetaParams<Encoding> = {},
  ): Promise<T> {
    return this.request({
      method: "GET",
      path,
      search: data as Record<string, unknown>,
      ...meta,
    }).then((response) => response.data as T);
  }

  post<T>(
    path: string,
    data?: unknown,
    meta: HttpMetaParams<Encoding> = {},
  ): Promise<T> {
    return this.request({
      method: "POST",
      path,
      body: data as Record<string, unknown>,
      ...meta,
    }).then((response) => response.data as T);
  }

  delete<T>(
    path: string,
    data?: unknown,
    meta: HttpMetaParams<Encoding> = {},
  ): Promise<T> {
    return this.request({
      method: "DELETE",
      path,
      body: data as Record<string, unknown>,
      ...meta,
    }).then((response) => response.data as T);
  }

  put<T>(
    path: string,
    data?: unknown,
    meta: HttpMetaParams<Encoding> = {},
  ): Promise<T> {
    return this.request({
      method: "PUT",
      path,
      body: data as Record<string, unknown>,
      ...meta,
    }).then((response) => response.data as T);
  }

  patch<T>(
    path: string,
    data?: unknown,
    meta: HttpMetaParams<Encoding> = {},
  ): Promise<T> {
    return this.request({
      method: "PATCH",
      path,
      body: data as Record<string, unknown>,
      ...meta,
    }).then((response) => response.data as T);
  }
}
