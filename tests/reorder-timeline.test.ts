/**
 * @vitest-environment jsdom
 */
import type { Status } from 'masto'
import { describe, expect, it } from 'vitest'
import { reorderedTimeline } from '~/composables/timeline'

function status(id: string): Status {
  return { id } as Status
}
function reply(id: string, s: Status) {
  return { id, inReplyToId: s.id } as Status
}
function reblog(id: string, s: Status) {
  return { id, reblog: s } as Status
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

describe('timeline reordering', () => {
  it('reorder basic', () => {
    expect(reorderedTimeline([p_a1, p_a2, p_a3]))
      .toMatchInlineSnapshot([p_a1, p_a2, p_a3])

    expect(reorderedTimeline([p_a3, p_a2, p_a1]))
      .toMatchInlineSnapshot([p_a1, p_a2, p_a3])

    expect(reorderedTimeline([p_a2, p_a3, p_a1]))
      .toMatchInlineSnapshot([p_a1, p_a2, p_a3])

    expect(reorderedTimeline([p_a2, p_b3, p_a3, p_b1, p_a1, p_b2]))
      .toMatchInlineSnapshot([p_a1, p_a2, p_a3, p_b1, p_b2, p_b3])

    expect(reorderedTimeline([r_a2, p_a1]))
      .toMatchInlineSnapshot([p_a1, r_a2])

    expect(reorderedTimeline([r_a2, p_b3, p_a3, p_b1, p_a1, r_b2]))
      .toMatchInlineSnapshot([p_a1, r_a2, p_a3, p_b1, r_b2, p_b3])

    expect(reorderedTimeline([r_a2, p_b3, p_a3, p_b1, p_a1, r_b2]))
      .toMatchInlineSnapshot([p_a1, r_a2, p_a3, p_b1, r_b2, p_b3])

    expect(reorderedTimeline([p_a1, p_b1, p_a2, p_b2, p_a3, p_b3]))
      .toMatchInlineSnapshot([p_a1, p_a2, p_a3, p_b1, p_b2, p_b3])

    expect(reorderedTimeline([r_a2, r_a1]))
      .toMatchInlineSnapshot([r_a1, r_a2])

    expect(reorderedTimeline([p_a3, r_a1, r_a2, r_b2, p_b3, r_b1]))
      .toMatchInlineSnapshot([r_a1, r_a2, p_a3, r_b1, r_b2, p_b3])
  })
})
