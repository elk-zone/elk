import type { MaybeRef } from '@vueuse/core'
import type { Account, Status } from 'masto'

export interface UseSearchOptions {
  type?: MaybeRef<'accounts' | 'hashtags' | 'statuses'>
}

export function useSearch(query: MaybeRef<string>, options?: UseSearchOptions) {
  let paginator = useMasto().search({ q: unref(query), type: unref(options?.type) })
  const done = ref(false)
  const loading = ref(false)
  const statuses = ref<Status[]>([])
  const accounts = ref<Account[]>([])
  const hashtags = ref<any[]>([])

  debouncedWatch(() => unref(query), async () => {
    if (!unref(query))
      return

    loading.value = true

    /**
     * Based on the source it seems like modifying the params when calling next would result in a new search,
     * but that doesn't seem to be the case. So instead we just create a new paginator with the new params.
     */
    paginator = useMasto().search({ q: unref(query), type: unref(options?.type) })
    const nextResults = await paginator.next()

    done.value = nextResults.done || false

    statuses.value = nextResults.value?.statuses || []
    accounts.value = nextResults.value?.accounts || []
    hashtags.value = nextResults.value?.hashtags || []

    loading.value = false
  }, { debounce: 500 })

  const next = async () => {
    if (!unref(query))
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
    accounts: readonly(accounts),
    hashtags: readonly(hashtags),
    statuses: readonly(statuses),
    loading: readonly(loading),
    next,
  }
}
