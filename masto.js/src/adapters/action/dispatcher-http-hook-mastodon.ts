import { snakeCase } from "change-case";

import {
  type ActionDispatcherHook,
  type AnyAction,
  type Encoding,
  type Http,
  type HttpMetaParams,
} from "../../interfaces";
import { type mastodon } from "../../mastodon";
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

async function waitForMediaAttachment(
  id: string,
  timeout: number,
  http: Http,
): Promise<mastodon.v1.MediaAttachment> {
  let media: mastodon.v1.MediaAttachment | undefined;
  const signal = AbortSignal.timeout(timeout);

  while (!media) {
    if (signal.aborted) {
      throw new MastoTimeoutError(`Media processing timed out of ${timeout}ms`);
    }

    try {
      await sleep(1000);

      const processing = await http.get<mastodon.v1.MediaAttachment>(
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

    return { type, path, data: action.data, meta };
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
      const media = result as mastodon.v1.MediaAttachment;
      if (isRecord(action.data) && action.data?.skipPolling === true) {
        return media;
      }
      return waitForMediaAttachment(media.id, this.mediaTimeout, this.http);
    }

    return result;
  }
}
