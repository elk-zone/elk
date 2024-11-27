/* eslint-disable unicorn/no-thenable */
import { type Http, type HttpMetaParams } from "../../interfaces";
import { type mastodon } from "../../mastodon";
import { parseLinkHeader } from "../../utils";

export class PaginatorHttp<Entity, Params = undefined>
  implements mastodon.Paginator<Entity, Params>
{
  constructor(
    private readonly http: Http,
    private nextPath?: string,
    private nextParams?: Params | string,
    private readonly meta?: HttpMetaParams,
    private readonly direction: mastodon.Direction = "next",
  ) {}

  async next(): Promise<IteratorResult<Entity, undefined>> {
    if (!this.nextPath) {
      return { done: true, value: undefined };
    }

    const response = await this.http.request({
      method: "GET",
      path: this.nextPath,
      search: this.nextParams as Record<string, unknown>,
      ...this.meta,
    });

    const nextUrl = this.getLink(response.headers.get("link"));
    this.nextPath = nextUrl?.pathname;
    this.nextParams = nextUrl?.search.replace(/^\?/, "");

    const data = (await response.data) as Entity;

    return {
      done: false,
      value: data,
    };
  }

  async return(
    value?: undefined | Promise<undefined>,
  ): Promise<IteratorResult<Entity, undefined>> {
    this.clear();
    return {
      done: true,
      value: await value,
    };
  }

  async throw(e: unknown): Promise<IteratorResult<Entity, undefined>> {
    this.clear();
    throw e;
  }

  then<TResult1 = Entity, TResult2 = never>(
    onfulfilled: (
      value: Entity,
    ) => TResult1 | PromiseLike<TResult1> = Promise.resolve.bind(Promise),
    onrejected: (
      reason: unknown,
    ) => TResult2 | PromiseLike<TResult2> = Promise.reject.bind(Promise),
  ): Promise<TResult1 | TResult2> {
    // we assume the first item won't be undefined
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.next().then((value) => onfulfilled(value.value!), onrejected);
  }

  values(): AsyncIterableIterator<Entity> {
    return this[Symbol.asyncIterator]();
  }

  getDirection(): mastodon.Direction {
    return this.direction;
  }

  setDirection(direction: mastodon.Direction): PaginatorHttp<Entity, Params> {
    return new PaginatorHttp(
      this.http,
      this.nextPath,
      this.nextParams,
      this.meta,
      direction,
    );
  }

  [Symbol.asyncIterator](): AsyncIterator<
    Entity,
    undefined,
    Params | string | undefined
  > {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this as any as AsyncIterator<
      Entity,
      undefined,
      Params | string | undefined
    >;
  }

  private getLink(value?: string | null): URL | undefined {
    if (!value) {
      return;
    }

    const parsed = parseLinkHeader(value).get(this.direction);
    if (!parsed) {
      return;
    }

    return new URL(parsed);
  }

  private clear() {
    this.nextPath = undefined;
    this.nextParams = undefined;
  }

  clone(): PaginatorHttp<Entity, Params> {
    return new PaginatorHttp(
      this.http,
      this.nextPath,
      this.nextParams,
      this.meta,
      this.direction,
    );
  }
}
