import {
  type Action,
  type ActionDispatcher,
  type Logger,
  type Serializer,
  type WebSocketConnector,
  type WebSocketSubscriptionCounter,
} from "../../interfaces";
import { MastoUnexpectedError } from "../errors";
import { WebSocketSubscription } from "../ws";

type WebSocketActionType = "close" | "prepare" | "subscribe";
type WebSocketAction = Action<WebSocketActionType>;

export class WebSocketActionDispatcher
  implements ActionDispatcher<WebSocketAction>
{
  constructor(
    private readonly connector: WebSocketConnector,
    private readonly counter: WebSocketSubscriptionCounter,
    private readonly serializer: Serializer,
    private readonly logger?: Logger,
  ) {}

  dispatch<T>(action: WebSocketAction): T {
    if (action.type === "close") {
      this.connector.kill();
      return {} as T;
    }

    if (action.type === "prepare") {
      return this.connector.acquire() as T;
    }

    if (action.type !== "subscribe") {
      throw new MastoUnexpectedError(`Unknown action type ${action.type}`);
    }

    const data = action.data ?? {};
    const stream = action.path.replace(/^\//, "").replaceAll("/", ":");

    return new WebSocketSubscription(
      this.connector,
      this.counter,
      this.serializer,
      stream,
      this.logger,
      { ...data },
    ) as T;
  }

  [Symbol.dispose](): void {
    this.connector.kill();
  }
}
