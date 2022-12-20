import type { Account } from 'masto/fetch'

export interface SearchResult {
  type: 'account' | 'hashtag' | 'action'
  to: string
  label?: string
  account?: Account
  hashtag?: any
  action?: {
    label: string
  }
}
