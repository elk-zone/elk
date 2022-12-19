import type { Account } from 'masto'

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
