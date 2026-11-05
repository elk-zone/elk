import type { mastodon } from 'masto'
import { describe, expect, it } from 'vitest'
import { isScheduledStatus } from '../../app/composables/masto/publish'

// Realistic ScheduledStatus fixture matching masto.js's camelCase deserialisation.
// masto.js transforms all JSON response keys with camelCase (SerializerNativeImpl
// → transformKeys(…, camelCase)), so there is NO `scheduled_at` at runtime — only
// `scheduledAt`. The old check `'scheduled_at' in status` was always false, making
// isScheduledStatus a no-op and causing navigateToStatus to be called with an object
// that has no `account`, throwing "can't access property acct".
const scheduledStatus: mastodon.v1.ScheduledStatus = {
  id: '1',
  scheduledAt: '2026-10-15T10:00:00.000Z',
  params: {
    id: 'fake',
    inReplyToId: 'parent-123',
    sensitive: false,
    spoilerText: '',
    visibility: 'public',
    text: 'hello scheduled world',
    applicationId: 'test-app',
    mediaIds: [],
  },
  mediaAttachments: [],
}

const regularStatus = {
  id: '2',
  content: '<p>hello world</p>',
  account: { acct: 'user@example.com' } as mastodon.v1.Account,
} as mastodon.v1.Status

describe('isScheduledStatus', () => {
  it('returns true for a ScheduledStatus (has scheduledAt, no account)', () => {
    expect(isScheduledStatus(scheduledStatus)).toBe(true)
  })

  it('returns false for a regular Status (has account, no scheduledAt)', () => {
    expect(isScheduledStatus(regularStatus)).toBe(false)
  })

  it('guards against accessing account on a ScheduledStatus', () => {
    // Reproduces issue #3723: the old code called navigateToStatus(status) before
    // checking for ScheduledStatus. navigateToStatus → getStatusRoute reads
    // status.account.acct, which throws for a ScheduledStatus (no account field).
    if (!isScheduledStatus(scheduledStatus)) {
      // This branch must NOT be taken for a ScheduledStatus.
      // TypeScript narrows to Status here, so account access is safe.
      const _acct = (scheduledStatus as unknown as mastodon.v1.Status).account.acct
      expect(_acct).toBeDefined() // unreachable with the fix in place
    }
    // Reaching here confirms we correctly identified the ScheduledStatus and
    // prevented the navigation that would have thrown "can't access property acct".
    expect(isScheduledStatus(scheduledStatus)).toBe(true)
  })
})
