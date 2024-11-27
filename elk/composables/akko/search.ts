import type { MaybeRefOrGetter } from '@vueuse/core'
import type { akkoma } from 'akko'
import type { RouteLocation } from 'vue-router'

export type UseSearchOptions = MaybeRefOrGetter<
  Partial<Omit<akkoma.rest.v2.SearchParams, keyof akkoma.DefaultPaginationParams | 'q'>>
>

export interface BuildSearchResult<K extends keyof any, T> {
  id: string
  type: K
  data: T
  to: RouteLocation & {
    href: string
  }
}
export type AccountSearchResult = BuildSearchResult<'account', akkoma.v1.Account>
export type HashTagSearchResult = BuildSearchResult<'hashtag', akkoma.v1.Tag>
export type StatusSearchResult = BuildSearchResult<'status', akkoma.v1.Status>

export type SearchResult = HashTagSearchResult | AccountSearchResult | StatusSearchResult

export function useSearch(query: MaybeRefOrGetter<string>, options: UseSearchOptions = {}) {
  const done = ref(false)
  const { client } = useAkko()
  const loading = ref(false)
  const accounts = ref<AccountSearchResult[]>([])
  const hashtags = ref<HashTagSearchResult[]>([])
  const statuses = ref<StatusSearchResult[]>([])

  const q = computed(() => resolveUnref(query).trim())

  let paginator: akkoma.Paginator<akkoma.v2.Search, akkoma.rest.v2.SearchParams> | undefined

  const appendResults = (results: akkoma.v2.Search, empty = false) => {
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
    loading.value = !!(q.value && isHydrated.value)
  })

  debouncedWatch(() => resolveUnref(query), async () => {
    if (!q.value || !isHydrated.value)
      return

    loading.value = true

    /**
     * Based on the source it seems like modifying the params when calling next would result in a new search,
     * but that doesn't seem to be the case. So instead we just create a new paginator with the new params.
     */
    paginator = client.value.v2.search.list({
      q: q.value,
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
    if (!q.value || !isHydrated.value || !paginator)
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
