import { type HttpMetaParams } from "../../../interfaces";
import { type Instance } from "../../entities/v2";

export interface InstanceRepository {
  /**
   * Information about the server.
   * @return Instance
   * @see https://docs.joinmastodon.org/methods/instance/
   */
  fetch(meta?: HttpMetaParams): Promise<Instance>;
}
