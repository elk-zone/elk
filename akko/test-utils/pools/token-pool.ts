import { type akkoma } from "../../src";

export interface TokenPool {
  acquire(): Promise<akkoma.v1.Token>;
  release(token: akkoma.v1.Token): Promise<void>;
}
