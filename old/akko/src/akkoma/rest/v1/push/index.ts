import { type WebPushSubscriptionRepository } from "./web-push-subscription-repository";

export interface PushRepository {
  readonly subscription: WebPushSubscriptionRepository;
}
