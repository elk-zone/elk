import type { MaybeComputedRef } from '@vueuse/core'
import type { Paginator, mastodon } from 'masto'
import type { RouteLocation } from 'vue-router'

export type UseSearchOptions = MaybeComputedRef<
  Partial<Omit<mastodon.v1.SearchParams, keyof mastodon.DefaultPaginationParams | 'q'>>
>

export interface BuildSearchResult<K extends keyof any, T> {
  id: string
  type: K
  data: T
  to: RouteLocation & {
    href: string
  }
}
export type AccountSearchResult = BuildSearchResult<'account', mastodon.v1.Account>
export type HashTagSearchResult = BuildSearchResult<'hashtag', mastodon.v1.Tag>
export type StatusSearchResult = BuildSearchResult<'status', mastodon.v1.Status>

export type SearchResult = HashTagSearchResult | AccountSearchResult | StatusSearchResult

export function useSearch(query: MaybeComputedRef<string>, options: UseSearchOptions = {}) {
  const done = ref(false)
  const { client } = $(useMasto())
  const loading = ref(false)
  const accounts = ref<AccountSearchResult[]>([])
  const hashtags = ref<HashTagSearchResult[]>([])
  const statuses = ref<StatusSearchResult[]>([])

  const q = $computed(() => resolveUnref(query).trim())

  let paginator: Paginator<mastodon.v2.Search, mastodon.v2.SearchParams> | undefined

  const appendResults = (results: mastodon.v2.Search, empty = false) => {
    if (empty) {
      accounts.value = []
      hashtags.value = []
      statuses.value = []
    }
    accounts.value = [...accounts.value, ...results.accounts.map<AccountSearchResult>(account => ({
      type: 'account',
      id: account.id,
      data: account,
      to: getAccountRoute(account),
    }))]
    hashtags.value = [...hashtags.value, ...results.hashtags.map<HashTagSearchResult>(hashtag => ({
      type: 'hashtag',
      id: `hashtag-${hashtag.name}`,
      data: hashtag,
      to: getTagRoute(hashtag.name),
    }))]
    statuses.value = [...statuses.value, ...results.statuses.map<StatusSearchResult>(status => ({
      type: 'status',
      id: status.id,
      data: status,
      to: getStatusRoute(status),
    }))]
  }

  watch(() => resolveUnref(query), () => {
    loading.value = !!(q && isHydrated.value)
  })

  debouncedWatch(() => resolveUnref(query), async () => {
    if (!q || !isHydrated.value)
      return

    loading.value = true

    /**
     * Based on the source it seems like modifying the params when calling next would result in a new search,
     * but that doesn't seem to be the case. So instead we just create a new paginator with the new params.
     */
    paginator = client.v2.search({
      q,
      ...resolveUnref(options),
      resolve: !!currentUser.value,
    })
    const nextResults = await paginator.next()

    done.value = !!nextResults.done
    if (!nextResults.done)
      appendResults(nextResults.value, true)

    loading.value = false
  }, { debounce: 300 })

  const next = async () => {
    if (!q || !isHydrated.value || !paginator)
      return

    loading.value = true
    const nextResults = await paginator.next()
    loading.value = false

    done.value = !!nextResults.done
    if (!nextResults.done)
      appendResults(nextResults.value)
  }

  return {
    accounts,
    hashtags,
    statuses,
    loading: readonly(loading),
    next,
  }
}
