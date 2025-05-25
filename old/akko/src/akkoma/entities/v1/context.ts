import { type Status } from "./status";

/**
 * Represents the tree around a given status. Used for reconstructing threads of statuses.
 * @see https://docs.joinmastodon.org/entities/context/
 */
export interface Context {
  /** Parents in the thread. */
  ancestors: Status[];
  /** Children in the thread. */
  descendants: Status[];
}
