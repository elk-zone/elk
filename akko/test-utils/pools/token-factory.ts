import { type akkoma } from "../../src";

export interface TokenFactory {
  obtain(): Promise<akkoma.v1.Token>;
}
