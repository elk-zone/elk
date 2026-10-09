import type { mastodon } from 'masto'
import { describe, expect, it } from 'vitest'
import { isScheduledStatus } from '../../app/composables/masto/publish'

const scheduledStatus = {
  id: '1',
  scheduledAt: '2026-10-15T10:00:00.000Z',
  // Mastodon serialises this as `scheduled_at` over the wire; masto.js exposes
  // both the camelCase and the raw snake_case key at runtime.
  scheduled_at: '2026-10-15T10:00:00.000Z',
  params: { text: 'hello' },
} as unknown as mastodon.v1.ScheduledStatus

const regularStatus = {
  id: '2',
  content: 'hello',
  account: { acct: 'user@example.com' } as mastodon.v1.Account,
} as mastodon.v1.Status

describe('isScheduledStatus', () => {
  it('returns true for a ScheduledStatus (has scheduled_at, no account)', () => {
    expect(isScheduledStatus(scheduledStatus)).toBe(true)
  })

  it('returns false for a regular Status (has account, no scheduled_at)', () => {
    expect(isScheduledStatus(regularStatus)).toBe(false)
  })

  it('guards against accessing account on a ScheduledStatus', () => {
    // The bug (issue #3723): publishDraft called navigateToStatus(status) before
    // checking scheduled_at, which accessed status.account.acct on a
    // ScheduledStatus that has no account field.
    // isScheduledStatus() is the guard that prevents that access.
    if (!isScheduledStatus(scheduledStatus)) {
      // This path must NOT be taken for a ScheduledStatus.
      // TypeScript now knows status.account is safe here.
      const _acct = (scheduledStatus as unknown as mastodon.v1.Status).account.acct
      expect(_acct).toBeDefined() // unreachable
    }
    // Reaching here means we correctly identified the scheduled status and
    // skipped the navigation that would have thrown "can't access property acct".
    expect(isScheduledStatus(scheduledStatus)).toBe(true)
  })
})
