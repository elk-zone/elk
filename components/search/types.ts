import type { Account, Status, Tag } from 'masto'
import type { RouteLocation } from 'vue-router'

export type BuildResult<K extends keyof any, T> = {
  [P in K]: T
} & {
  id: string
  type: K
  to: RouteLocation & {
    href: string
  }
}
export type HashTagResult = BuildResult<'hashtag', Tag>
export type AccountResult = BuildResult<'account', Account>
export type StatusResult = BuildResult<'status', Status>

export type SearchResult = HashTagResult | AccountResult | StatusResult
