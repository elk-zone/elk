import type { DraftItem } from '#shared/types'
/**
 * Integration-level ordering test for publishDraft.
 *
 * Tests that publishDraft does NOT call navigateToStatus when the API returns a
 * ScheduledStatus (no `account` field), and DOES call it for a regular reply.
 * Uses mockNuxtImport to replace auto-imported composables so the test can drive
 * the masto client and observe navigation calls without a real Mastodon server.
 */
import type { mastodon } from 'masto'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createApp, ref } from 'vue'

// ---------------------------------------------------------------------------
// Spies — hoisted so the mockNuxtImport factory closures can reference
// them before the module is evaluated.
// ---------------------------------------------------------------------------
const mockCreate = vi.hoisted(() => vi.fn<() => Promise<mastodon.v1.Status | mastodon.v1.ScheduledStatus>>())
const mockNavigateToStatus = vi.hoisted(() => vi.fn())

// ---------------------------------------------------------------------------
// Auto-import mocks
//
// IMPORTANT: mockNuxtImport factories are hoisted (like vi.mock factories) and
// run before top-level imports are initialised. Do NOT reference top-level
// import bindings (e.g. `ref` from 'vue') inside these factories — use plain
// objects with a `.value` property instead of proper Vue refs.
// ---------------------------------------------------------------------------
mockNuxtImport('useMasto', () => () => ({
  // Plain object that behaves like shallowRef for read-only .value access.
  client: { value: { v1: { statuses: { create: mockCreate } } } },
}))

mockNuxtImport('navigateToStatus', () => mockNavigateToStatus)

// htmlToText is called by isEmptyDraft to decide whether the draft is empty.
// Return the input unchanged so any non-empty status string is treated as content.
mockNuxtImport('htmlToText', () => (text: string) => text ?? '')

// currentUser and currentInstance are module-level refs; mock as plain objects.
mockNuxtImport('currentUser', () => ({
  value: { account: { source: { language: 'en' } } },
}))

mockNuxtImport('currentInstance', () => ({ value: null }))

mockNuxtImport('useUserSettings', () => () => ({ value: { language: 'en' } }))

// isGlitchEdition is a computed ref exported from users.ts.
mockNuxtImport('isGlitchEdition', () => ({ value: false }))

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Run a composable inside a minimal Vue app so Vue reactivity works. */
function withSetup<T>(fn: () => T): T {
  let result!: T
  const app = createApp({
    setup() {
      result = fn()
      return () => null
    },
  })
  app.mount(document.createElement('div'))
  return result
}

function makeDraftItem(overrides: Partial<DraftItem['params']> = {}): DraftItem {
  return {
    params: {
      status: 'hello from test',
      inReplyToId: null,
      sensitive: false,
      spoilerText: '',
      visibility: 'public',
      language: 'en',
      scheduledAt: undefined,
      poll: null,
      quotedStatusId: null,
      quoteApprovalPolicy: 'public',
      ...overrides,
    },
    attachments: [],
    mentions: [],
    lastUpdated: Date.now(),
  }
}

function makeScheduledStatus(): mastodon.v1.ScheduledStatus {
  return {
    id: '999',
    scheduledAt: '2026-10-15T10:00:00.000Z',
    params: {
      id: 'fake',
      inReplyToId: 'parent-id',
      sensitive: false,
      spoilerText: '',
      visibility: 'public',
      text: 'hello from test',
      applicationId: 'test-app',
      mediaIds: [],
    },
    mediaAttachments: [],
  }
}

function makeRegularStatus(): mastodon.v1.Status {
  return {
    id: '1000',
    content: '<p>hello from test</p>',
    account: { id: 'acct1', acct: 'user@example.com' } as mastodon.v1.Account,
  } as mastodon.v1.Status
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('publishDraft — scheduled-status ordering (issue #3723)', () => {
  beforeEach(() => {
    mockCreate.mockReset()
    mockNavigateToStatus.mockReset()
  })

  it('does NOT call navigateToStatus when API returns ScheduledStatus for a reply', async () => {
    mockCreate.mockResolvedValue(makeScheduledStatus())

    const draftItem = ref(makeDraftItem({
      inReplyToId: 'parent-id',
      scheduledAt: '2026-10-15T10:00:00.000Z',
    }))

    const { publishDraft } = withSetup(() =>
      usePublish({
        draftItem,
        expanded: ref(true),
        isUploading: ref(false),
        isPartOfThread: false,
        initialDraft: () => makeDraftItem(),
      }),
    )

    const result = await publishDraft()

    // Scheduled posts: publishDraft returns undefined (caller shows "scheduled" UI).
    expect(result).toBeUndefined()
    // Core regression check: navigateToStatus must NOT be called for a ScheduledStatus.
    // The bug was that it was called before the scheduledAt guard, then crashed on
    // status.account.acct — a field ScheduledStatus does not have.
    expect(mockNavigateToStatus).not.toHaveBeenCalled()
  })

  it('dOES call navigateToStatus for a regular (non-scheduled) reply', async () => {
    const regular = makeRegularStatus()
    mockCreate.mockResolvedValue(regular)

    const draftItem = ref(makeDraftItem({ inReplyToId: 'parent-id' }))

    const { publishDraft } = withSetup(() =>
      usePublish({
        draftItem,
        expanded: ref(true),
        isUploading: ref(false),
        isPartOfThread: false,
        initialDraft: () => makeDraftItem(),
      }),
    )

    const result = await publishDraft()

    expect(result).toEqual(regular)
    expect(mockNavigateToStatus).toHaveBeenCalledOnce()
    expect(mockNavigateToStatus).toHaveBeenCalledWith({ status: regular })
  })

  it('does NOT call navigateToStatus for a non-reply regular status', async () => {
    mockCreate.mockResolvedValue(makeRegularStatus())

    const draftItem = ref(makeDraftItem()) // no inReplyToId

    const { publishDraft } = withSetup(() =>
      usePublish({
        draftItem,
        expanded: ref(true),
        isUploading: ref(false),
        isPartOfThread: false,
        initialDraft: () => makeDraftItem(),
      }),
    )

    await publishDraft()

    expect(mockNavigateToStatus).not.toHaveBeenCalled()
  })
})
