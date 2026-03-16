/** @vitest-environment happy-dom */

import type { mastodon } from 'masto'
import { describe, expect, it } from 'vitest'
import { removeFilteredItems, reorderTimeline } from '../../app/composables/timeline'

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

const post_a1 = status('post_a1')
const post_b1 = status('post_b1')

const post_a2 = reply('post_a2', post_a1)
const post_b2 = reply('post_b2', post_b1)

const post_a3 = reply('post_a3', post_a2)
const post_b3 = reply('post_b3', post_b2)

const reblog_a1 = reblog('reblog_a1', post_a1)
const reblog_b1 = reblog('reblog_b1', post_b1)

const reblog_a2 = reblog('reblog_a2', post_a2)
const reblog_b2 = reblog('reblog_b2', post_b2)

const public_filter = status('f1', 'public')
const reply_public_filter = reply('reblog_f1', public_filter)
const reblog_public_filter = reblog('rb_f1', public_filter)
const notifications_filter = status('f2', 'notifications')

describe('timeline reordering', () => {
  it('reorder basic', () => {
    expect(reorderTimeline(removeFilteredItems(
      [reblog_a2, reblog_a1],
      'public',
    )))
      .toEqual([reblog_a1, reblog_a2])

    expect(reorderTimeline(removeFilteredItems(
      [reblog_a2, post_a1],
      'public',
    )))
      .toEqual([post_a1, reblog_a2])

    expect(reorderTimeline(removeFilteredItems(
      [post_a1, post_a2, post_a3],
      'public',
    )))
      .toEqual([post_a1, post_a2, post_a3])

    expect(reorderTimeline(removeFilteredItems(
      [post_a3, post_a2, post_a1],
      'public',
    )))
      .toEqual([post_a1, post_a2, post_a3])

    expect(reorderTimeline(removeFilteredItems(
      [post_a2, post_a3, post_a1],
      'public',
    )))
      .toEqual([post_a1, post_a2, post_a3])

    expect(reorderTimeline(removeFilteredItems(
      [post_a2, post_b3, post_a3, post_b1, post_a1, post_b2],
      'public',
    )))
      .toEqual([post_a1, post_a2, post_a3, post_b1, post_b2, post_b3])

    expect(reorderTimeline(removeFilteredItems(
      [reblog_a2, post_b3, post_a3, post_b1, post_a1, reblog_b2],
      'public',
    )))
      .toEqual([post_a1, reblog_a2, post_a3, post_b1, reblog_b2, post_b3])

    expect(reorderTimeline(removeFilteredItems(
      [reblog_a2, post_b3, post_a3, post_b1, post_a1, reblog_b2],
      'public',
    )))
      .toEqual([post_a1, reblog_a2, post_a3, post_b1, reblog_b2, post_b3])

    expect(reorderTimeline(removeFilteredItems(
      [post_a1, post_b1, post_a2, post_b2, post_a3, post_b3],
      'public',
    )))
      .toEqual([post_a1, post_a2, post_a3, post_b1, post_b2, post_b3])

    expect(reorderTimeline(removeFilteredItems(
      [post_a3, reblog_a1, reblog_a2, reblog_b2, post_b3, reblog_b1],
      'public',
    )))
      .toEqual([reblog_a1, reblog_a2, post_a3, reblog_b1, reblog_b2, post_b3])
  })

  it('reorder with filtered item', () => {
    // should not show filtered status with 'hide' filterAction
    expect(reorderTimeline(removeFilteredItems(
      [post_a3, public_filter, reblog_a1, reblog_a2, reblog_b2, post_b3, reblog_b1],
      'public',
    )))
      .toEqual([reblog_a1, reblog_a2, post_a3, reblog_b1, reblog_b2, post_b3])

    // should not filter status with 'hide' filterAction but does not match context
    expect(reorderTimeline(removeFilteredItems(
      [post_a3, notifications_filter, reblog_a1, reblog_a2, reblog_b2, post_b3, reblog_b1],
      'public',
    )))
      .toEqual([reblog_a1, reblog_a2, post_a3, notifications_filter, reblog_b1, reblog_b2, post_b3])

    // should filter status with 'hide' filterAction and matches context
    expect(reorderTimeline(removeFilteredItems(
      [post_a3, notifications_filter, reblog_a1, reblog_a2, reblog_b2, post_b3, reblog_b1],
      'notifications',
    )))
      .toEqual([reblog_a1, reblog_a2, post_a3, reblog_b1, reblog_b2, post_b3])

    // should show reply to a filtered status
    expect(reorderTimeline(removeFilteredItems(
      [post_a3, public_filter, reblog_a1, reply_public_filter, reblog_a2, reblog_b2, post_b3, reblog_b1],
      'public',
    )))
      .toEqual([reblog_a1, reblog_a2, post_a3, reply_public_filter, reblog_b1, reblog_b2, post_b3])

    // should not show reblogged status that is filtered with 'hide' filterAction
    expect(reorderTimeline(removeFilteredItems(
      [post_a3, public_filter, reblog_a1, reblog_public_filter, reblog_a2, reblog_b2, post_b3, reblog_b1],
      'public',
    )))
      .toEqual([reblog_a1, reblog_a2, post_a3, reblog_b1, reblog_b2, post_b3])
  })
})
