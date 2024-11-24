import type { mastodon } from 'masto'
import { MastoHttpError, MastoUnexpectedError } from 'masto'

interface queryParams {
  limit?: number
  max_id?: string
  min_id?: string
}

async function request({ limit, max_id, min_id }: queryParams = { limit: 30, max_id: undefined, min_id: undefined }): Promise<mastodon.v1.Status[]> {
  const request = fetch(`https://${currentUser.value?.server}/api/v1/timelines/bubble?limit=${limit}&max_id=${max_id || ''}&min_id=${min_id || ''}`, {
    headers: {
      Authorization: `Bearer ${currentUser.value?.token}`,
    },
  })
  let response
  try {
    response = await request
  }
  catch (e) {
    console.error(e)
    const err = e as Error
    throw new MastoUnexpectedError(err.message, { cause: err.cause })
  }
  if (response.ok) {
    return response.json()
  }
  throw new MastoHttpError({ statusCode: response.status, message: response.statusText })
}

function makeIterator(direction: 'prev' | 'next', limit?: number, max_id?: string, min_id?: string) {
  return async function*(): AsyncIterator<mastodon.v1.Status[], undefined, queryParams> {
    let status = await request({ limit, max_id, min_id })
    while (status.length > 0) {
      yield status.map(normalizeAPIEntity)
      const s = status[status.length - 1]
      status = await request({ limit, max_id: direction === 'next' ? s?.id : undefined, min_id: direction === 'prev' ? s.id : undefined })
    }
  }
}

export function makeBubbleTimelinePaginator({ limit, max_id, min_id }: queryParams = {}, direction: 'prev' | 'next' = 'next'): mastodon.Paginator<mastodon.v1.Status[], queryParams> {
  const it = makeIterator(direction, limit, max_id, min_id)
  const seq = it() as unknown as mastodon.Paginator<mastodon.v1.Status[], queryParams>
  seq.clone = () => makeBubbleTimelinePaginator({ limit, max_id, min_id }, direction)
  seq.getDirection = () => direction
  seq.setDirection = dir => makeBubbleTimelinePaginator({ limit, max_id, min_id }, dir)
  return seq
}
