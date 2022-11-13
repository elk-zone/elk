import { Headers, createFetch, fetch } from 'ohmyfetch'
import type { Post } from './types'

export interface MastodonClientOptions {
  host: string
}

export class Client {
  $fetch: ReturnType<typeof createFetch> = undefined!

  constructor(public options: MastodonClientOptions) {
    this.$fetch = createFetch({
      defaults: {
        baseURL: options.host,
      },
      fetch,
      Headers,
    })
  }

  getPublicTimeline(): Promise<Post[]> {
    return this.$fetch('/api/v1/timelines/public')
  }
}
