import type { mastodon } from 'masto'
import { snakeCase } from 'change-case'
import { makeBubbleTimelinePaginator } from './timelines'

export const AkkomaFeatures = {
  BUBBLE_TIMELINE: 'bubble_timeline',
}

export type AkkomaInstance = mastodon.v1.Instance & {
  pleroma: {
    metadata: {
      features: AkkomaInstance[keyof AkkomaInstance][]
    }
  }
}

export function normalizeAPIEntity(ent: any) {
  return new Proxy(ent, { get: (target: any, prop: string) => {
    if (target[snakeCase(prop)])
      return target[snakeCase(prop)]
  } })
}

export function useAkkomaClient() {
  return {
    v1: {
      timelines: {
        bubble: {
          list: makeBubbleTimelinePaginator,
        },
      },

    },
  }
}
