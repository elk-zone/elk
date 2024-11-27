import { type Event } from "./event";

export interface SubscribeListParams {
  readonly list: string;
}

export interface SubscribeHashtagParams {
  readonly tag: string;
}

export interface Subscription extends AsyncIterable<Event>, Disposable {
  values(): AsyncIterableIterator<Event>;
  unsubscribe(): void;
}

export interface Client extends Disposable {
  public: {
    subscribe(): Subscription;
    media: {
      subscribe(): Subscription;
    };
    local: {
      subscribe(): Subscription;
      media: {
        subscribe(): Subscription;
      };
    };
    remote: {
      subscribe(): Subscription;
      media: {
        subscribe(): Subscription;
      };
    };
  };
  hashtag: {
    subscribe(params: SubscribeHashtagParams): Subscription;
    local: {
      subscribe(params: SubscribeHashtagParams): Subscription;
    };
  };
  list: {
    subscribe(params: SubscribeListParams): Subscription;
  };
  direct: {
    subscribe(): Subscription;
  };
  user: {
    subscribe(): Subscription;
    notification: {
      subscribe(): Subscription;
    };
  };

  close(): void;

  /** @internal */
  prepare(): Promise<void>;
}
