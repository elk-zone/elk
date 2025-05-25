import { type HttpMetaParams } from "../../../interfaces";
import {
  type Marker,
  type MarkerItem,
  type MarkerTimeline,
} from "../../entities/v1";

export interface FetchMarkersParams {
  /**
   * Array of markers to fetch.
   * String enum anyOf `home`, `notifications`.
   * If not provided, an empty object will be returned.
   */
  readonly timeline?: readonly MarkerTimeline[];
}

export type CreateMarkersParams = {
  /** ID of the last status read in the timeline. */
  readonly [key in MarkerTimeline]?: Pick<MarkerItem, "lastReadId">;
};

export interface MarkerRepository {
  /**
   * Get saved timeline position
   * @param params Parameters
   * @return Markers
   * @see https://docs.joinmastodon.org/methods/timelines/markers/
   */
  fetch(params?: FetchMarkersParams, meta?: HttpMetaParams): Promise<Marker>;

  /**
   * Save position in timeline
   * @param params Parameters
   * @return Markers
   * @see https://github.com/tootsuite/mastodon/pull/11762
   */
  create(
    params: CreateMarkersParams,
    meta?: HttpMetaParams<"json">,
  ): Promise<Marker>;
}
