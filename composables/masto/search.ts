import type { MaybeRef } from '@vueuse/core'
import type { Account, Paginator, Results, SearchParams, Status } from 'masto'

export interface UseSearchOptions {
  type?: MaybeRef<'accounts' | 'hashtags' | 'statuses'>
}

export function useSearch(query: MaybeRef<string>, options?: UseSearchOptions) {
  const done = ref(false)
  const masto = useMasto()
  const loading = ref(false)
  const statuses = ref<Status[]>([])
  const accounts = ref<Account[]>([])
  const hashtags = ref<any[]>([])

  let paginator: Paginator<SearchParams, Results> | undefined

  debouncedWatch(() => unref(query), async () => {
    if (!unref(query) || !isMastoInitialised.value)
      return

    loading.value = true

    /**
     * Based on the source it seems like modifying the params when calling next would result in a new search,
     * but that doesn't seem to be the case. So instead we just create a new paginator with the new params.
     */
    paginator = masto.search({ q: unref(query), resolve: !isGuest.value, type: unref(options?.type) })
    const nextResults = await paginator.next()

    done.value = nextResults.done || false

    statuses.value = nextResults.value?.statuses || []
    accounts.value = nextResults.value?.accounts || []
    hashtags.value = nextResults.value?.hashtags || []

    loading.value = false
  }, { debounce: 500 })

  const next = async () => {
    if (!unref(query) || !isMastoInitialised.value || !paginator)
      return

    loading.value = true
    const nextResults = await paginator.next()
    loading.value = false

    done.value = nextResults.done || false
    statuses.value = [
      ...statuses.value,
      ...(nextResults.value.statuses || []),
    ]
    accounts.value = [
      ...statuses.value,
      ...(nextResults.value.accounts || []),
    ]
    hashtags.value = [
      ...statuses.value,
      ...(nextResults.value.statuses || []),
    ]
  }

  return {
    accounts,
    hashtags,
    statuses,
    loading: readonly(loading),
    next,
  }
}
