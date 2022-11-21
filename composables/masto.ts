import type { Account } from 'masto'

export function getDisplayName(account: Account) {
  return account.displayName || account.username
}
