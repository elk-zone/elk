import { type HttpMetaParams } from "../../../interfaces";
import { type Tag } from "../../entities/v1";
import { type Paginator } from "../../paginator";
import { type DefaultPaginationParams } from "../../repository";

export interface FollowedTagRepository {
  list(
    params?: DefaultPaginationParams,
    meta?: HttpMetaParams,
  ): Paginator<Tag[], DefaultPaginationParams>;
}
