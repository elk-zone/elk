import type { Account, Status } from 'masto'

export interface SearchResult {
  type: 'account' | 'hashtag' | 'action' | 'status'
  to: string
  label?: string
  account?: Account
  status?: Status
  hashtag?: any
  action?: {
    label: string
  }
}
