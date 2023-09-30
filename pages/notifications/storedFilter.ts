import type { mastodon } from 'masto'
import { STORAGE_KEY_NOTIFICATION_FILTER } from '~/constants'

const { acct } = currentUser.value?.account || { acct: 'hey' }
export const storedFilter = useLocalStorage<{ [account: string]: mastodon.v1.NotificationType }>(STORAGE_KEY_NOTIFICATION_FILTER, () => ({ [acct]: 'mention' }))
