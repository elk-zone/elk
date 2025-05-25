import { snakeCase } from "change-case";

import { type akkoma } from "../../akkoma";
import { type ReactionsStatusParam } from "../../akkoma/rest/v1";
import {
  type ActionDispatcherHook,
  type AnyAction,
  type Encoding,
  type Http,
  type HttpMetaParams,
} from "../../interfaces";
import { isRecord, sleep } from "../../utils";
import { MastoHttpError, MastoTimeoutError } from "../errors";
import { type HttpAction, type HttpActionType } from "./dispatcher-http";

function isHttpActionType(actionType: string): actionType is HttpActionType {
  return ["fetch", "create", "update", "remove", "list"].includes(actionType);
}

function toHttpActionType(action: string): HttpActionType {
  if (isHttpActionType(action)) {
    return action;
  }

  switch (action) {
    case "lookup":
    case "verify_credentials": {
      return "fetch";
    }
    case "update_credentials": {
      return "update";
    }
    case "react": {
      return "update";
    }
    case "unreact": {
      return "remove";
    }
    default: {
      return "create";
    }
  }
}

function inferEncoding(action: HttpActionType, path: string): Encoding {
  if (
    (action === "create" && path === "/api/v1/accounts") ||
    (action === "update" && path === "/api/v1/accounts/update_credentials") ||
    (action === "create" && path === "/api/v1/email") ||
    (action === "create" && path === "/api/v1/featured_tag") ||
    (action === "create" && path === "/api/v1/media") ||
    (action === "create" && path === "/api/v2/media")
  ) {
    return "multipart-form";
  }

  return "json";
}

/**
 * Some Akkoma API path are prefixed with /pleroma or /akkoma compared to a classic masotdon call
 * @param action the action we are trying to do
 * @returns the actual action to use
 */
function inferAkkomaAction(action: HttpAction): HttpAction {
  const reactionPath = action.path.match(
    /\/api\/v1\/statuses\/(.+)\/(un)?react/,
  );
  if (reactionPath) {
    const data = action.data as ReactionsStatusParam;
    return {
      ...action,
      path:
        "/api/v1/pleroma/statuses/" +
        reactionPath[1] +
        "/reactions/" +
        data.emoji,
      data: undefined,
    };
  }
  return action;
}

async function waitForMediaAttachment(
  id: string,
  timeout: number,
  http: Http,
): Promise<akkoma.v1.MediaAttachment> {
  let media: akkoma.v1.MediaAttachment | undefined;
  const signal = AbortSignal.timeout(timeout);

  while (!media) {
    if (signal.aborted) {
      throw new MastoTimeoutError(`Media processing timed out of ${timeout}ms`);
    }

    try {
      await sleep(1000);

      const processing = await http.get<akkoma.v1.MediaAttachment>(
        `/api/v1/media/${id}`,
      );

      if (processing.url) {
        media = processing;
      }
    } catch (error) {
      if (error instanceof MastoHttpError && error.statusCode === 404) {
        continue;
      }
      throw error;
    }
  }

  return media;
}

export class HttpActionDispatcherHookMastodon
  implements ActionDispatcherHook<AnyAction>
{
  constructor(
    private readonly http: Http,
    private readonly mediaTimeout = 1000 * 60,
  ) {}

  beforeDispatch(action: AnyAction): HttpAction {
    const type = toHttpActionType(action.type);
    const path = isHttpActionType(action.type)
      ? action.path
      : action.path + "/" + snakeCase(action.type);
    const encoding = inferEncoding(type, path);
    const meta: HttpMetaParams<Encoding> = { ...action.meta, encoding };

    return inferAkkomaAction({ type, path, data: action.data, meta });
  }

  dispatch(action: AnyAction): false | Promise<unknown> {
    if (
      action.type === "update" &&
      action.path === "/api/v1/accounts/update_credentials"
    ) {
      return this.http.patch(action.path, action.data, action.meta);
    }

    return false;
  }

  afterDispatch(action: AnyAction, result: unknown): unknown {
    if (action.type === "create" && action.path === "/api/v2/media") {
      const media = result as akkoma.v1.MediaAttachment;
      if (isRecord(action.data) && action.data?.skipPolling === true) {
        return media;
      }
      return waitForMediaAttachment(media.id, this.mediaTimeout, this.http);
    }

    return result;
  }
}
