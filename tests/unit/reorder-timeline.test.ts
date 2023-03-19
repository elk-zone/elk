/** @vitest-environment happy-dom */

import type { mastodon } from 'masto'
import { describe, expect, it } from 'vitest'

function status(id: string, filtered?: mastodon.v1.FilterContext): mastodon.v1.Status {
  const fakeStatus = {
    id,
    account: {
      id: 'FAKE ID',
    } as mastodon.v1.Account,
  } as mastodon.v1.Status

  if (filtered) {
    fakeStatus.filtered
       = [
        {
          filter: {
            filterAction: 'hide',
            context: [filtered],
          },
        } as mastodon.v1.FilterResult,
      ]
  }

  return fakeStatus
}

function reply(id: string, s: mastodon.v1.Status) {
  return {
    id,
    account: {
      id: 'FAKE ID',
    } as mastodon.v1.Account,
    inReplyToId: s.id,
  } as mastodon.v1.Status
}

function reblog(id: string, s: mastodon.v1.Status) {
  return {
    id,
    account: {
      id: 'FAKE ID',
    } as mastodon.v1.Account,
    reblog: s,
  } as mastodon.v1.Status
}

const p_a1 = status('p_a1')
const p_b1 = status('p_b1')

const p_a2 = reply('p_a2', p_a1)
const p_b2 = reply('p_b2', p_b1)

const p_a3 = reply('p_a3', p_a2)
const p_b3 = reply('p_b3', p_b2)

const r_a1 = reblog('r_a1', p_a1)
const r_b1 = reblog('r_b1', p_b1)

const r_a2 = reblog('r_a2', p_a2)
const r_b2 = reblog('r_b2', p_b2)

const f1 = status('f1', 'public')
const r_f1 = reply('r_f1', f1)
const rb_f1 = reblog('rb_f1', f1)
const n_f2 = status('f2', 'notifications')

describe('timeline reordering', () => {
  it('reorder basic', () => {
    expect(reorderedTimeline([r_a2, r_a1])).toEqual([r_a1, r_a2])

    expect(reorderedTimeline([r_a2, p_a1])).toEqual([p_a1, r_a2])

    expect(reorderedTimeline([p_a1, p_a2, p_a3])).toEqual([p_a1, p_a2, p_a3])

    expect(reorderedTimeline([p_a3, p_a2, p_a1])).toEqual([p_a1, p_a2, p_a3])

    expect(reorderedTimeline([p_a2, p_a3, p_a1])).toEqual([p_a1, p_a2, p_a3])

    expect(reorderedTimeline([p_a2, p_b3, p_a3, p_b1, p_a1, p_b2])).toEqual([p_a1, p_a2, p_a3, p_b1, p_b2, p_b3])

    expect(reorderedTimeline([r_a2, p_b3, p_a3, p_b1, p_a1, r_b2])).toEqual([p_a1, r_a2, p_a3, p_b1, r_b2, p_b3])

    expect(reorderedTimeline([r_a2, p_b3, p_a3, p_b1, p_a1, r_b2])).toEqual([p_a1, r_a2, p_a3, p_b1, r_b2, p_b3])

    expect(reorderedTimeline([p_a1, p_b1, p_a2, p_b2, p_a3, p_b3])).toEqual([p_a1, p_a2, p_a3, p_b1, p_b2, p_b3])

    expect(reorderedTimeline([p_a3, r_a1, r_a2, r_b2, p_b3, r_b1])).toEqual([r_a1, r_a2, p_a3, r_b1, r_b2, p_b3])
  })

  it('reorder with filtered item', () => {
    // should not show filtered status with 'hide' filterAction
    expect(reorderedTimeline([p_a3, f1, r_a1, r_a2, r_b2, p_b3, r_b1])).toEqual([r_a1, r_a2, p_a3, r_b1, r_b2, p_b3])

    // should not filter status with 'hide' filterAction but does not match context
    expect(reorderedTimeline([p_a3, n_f2, r_a1, r_a2, r_b2, p_b3, r_b1], 'public')).toEqual([r_a1, r_a2, p_a3, n_f2, r_b1, r_b2, p_b3])

    // should filter status with 'hide' filterAction and matches context
    expect(reorderedTimeline([p_a3, n_f2, r_a1, r_a2, r_b2, p_b3, r_b1], 'notifications')).toEqual([r_a1, r_a2, p_a3, r_b1, r_b2, p_b3])

    // should show reply to a filtered status
    expect(reorderedTimeline([p_a3, f1, r_a1, r_f1, r_a2, r_b2, p_b3, r_b1])).toEqual([r_a1, r_a2, p_a3, r_f1, r_b1, r_b2, p_b3])

    // should not show reblogged status that is filtered with 'hide' filterAction
    expect(reorderedTimeline([p_a3, f1, r_a1, rb_f1, r_a2, r_b2, p_b3, r_b1])).toEqual([r_a1, r_a2, p_a3, r_b1, r_b2, p_b3])
  })
})
