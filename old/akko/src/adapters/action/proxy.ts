import { snakeCase } from "change-case";

import {
  type ActionDispatcher,
  type AnyAction,
  type HttpMetaParams,
} from "../../interfaces";
import { noop } from "../../utils/noop";

type CreateActionProxyOptions = {
  readonly context?: string[];
  readonly applicable?: boolean;
};

export const createActionProxy = <T>(
  actionDispatcher: ActionDispatcher<AnyAction>,
  options: CreateActionProxyOptions = {},
): T => {
  const { context = [], applicable = false } = options;

  let target = {};
  const handler: ProxyHandler<typeof noop> = {
    get: get(actionDispatcher, context),
  };

  if (applicable) {
    target = noop;
    handler.apply = apply(actionDispatcher, context);
  }

  return new Proxy(target, handler) as T;
};

const SPECIAL_PROPERTIES = new Set([
  "then",
  "catch",
  "finally",
  "inspect",
  "toString",
  "valueOf",
  "toJSON",
  "constructor",
  "prototype",
  "length",
  "name",
  "caller",
  "callee",
  "arguments",
  "bind",
  "apply",
  "call",
]);

const get =
  <T>(
    actionDispatcher: ActionDispatcher<AnyAction>,
    context: readonly string[],
  ) =>
  (_: unknown, property: string | symbol) => {
    if (typeof property === "string" && SPECIAL_PROPERTIES.has(property)) {
      return;
    }
    if (property === Symbol.dispose) {
      return actionDispatcher[Symbol.dispose];
    }
    if (typeof property === "symbol") {
      return;
    }
    if (property.startsWith("$")) {
      return createActionProxy<T>(actionDispatcher, {
        context: [...context, property],
        applicable: true,
      });
    }
    return createActionProxy<T>(actionDispatcher, {
      context: [...context, snakeCase(property)],
      applicable: true,
    });
  };

const apply =
  <T>(actionDispatcher: ActionDispatcher<AnyAction>, context: string[]) =>
  (_1: unknown, _2: unknown, args: unknown[]): unknown => {
    const action = context.pop();

    /* istanbul ignore next */
    if (!action) {
      throw new Error("No action specified");
    }

    if (action === "$select") {
      return createActionProxy<T>(actionDispatcher, {
        context: [...context, ...(args as string[])],
        applicable: true,
      });
    }

    const path = "/" + context.join("/");
    const [data, meta] = args;

    return actionDispatcher.dispatch<T>({
      type: action,
      path,
      data,
      meta: meta as HttpMetaParams,
    });
  };
