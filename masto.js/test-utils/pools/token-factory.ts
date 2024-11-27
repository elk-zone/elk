import { type mastodon } from "../../src";

export interface TokenFactory {
  obtain(): Promise<mastodon.v1.Token>;
}
