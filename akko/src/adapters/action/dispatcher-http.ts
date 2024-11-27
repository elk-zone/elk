import {
  type Action,
  type ActionDispatcher,
  type ActionDispatcherHook,
  type Http,
} from "../../interfaces";
import { PaginatorHttp } from "./paginator-http";

export type HttpActionType = "fetch" | "create" | "update" | "remove" | "list";
export type HttpAction = Action<HttpActionType>;

export class HttpActionDispatcher implements ActionDispatcher<HttpAction> {
  constructor(
    private readonly http: Http,
    private readonly hook: ActionDispatcherHook<HttpAction>,
  ) {}

  dispatch<T>(action: HttpAction): T | Promise<T> {
    if (this.hook) {
      action = this.hook.beforeDispatch(action);
    }

    let result = this.hook.dispatch(action) as T | Promise<T> | false;
    if (result !== false) {
      return result;
    }

    switch (action.type) {
      case "fetch": {
        result = this.http.get(action.path, action.data, action.meta);
        break;
      }
      case "create": {
        result = this.http.post(action.path, action.data, action.meta);
        break;
      }
      case "update": {
        result = this.http.put(action.path, action.data, action.meta);
        break;
      }
      case "remove": {
        result = this.http.delete(action.path, action.data, action.meta);
        break;
      }
      case "list": {
        result = new PaginatorHttp(this.http, action.path, action.data) as T;
        break;
      }
    }

    /* eslint-disable unicorn/prefer-ternary, prettier/prettier */
    if (result instanceof Promise) {
      return result.then((result) => this.hook?.afterDispatch(action, result)) as Promise<T>;
    } else {
      return this.hook.afterDispatch(action, result) as T;
    }
    /* eslint-enable unicorn/prefer-ternary, prettier/prettier */
  }
}
