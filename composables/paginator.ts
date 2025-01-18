import type { mastodon } from 'masto'
import type { Ref } from 'vue'
import type { PaginatorState } from '~/types'

export function usePaginator<T, P, U = T>(
  _paginator: mastodon.Paginator<T[], P>,
  stream: Ref<mastodon.streaming.Subscription | undefined>,
  eventType: 'update' | 'notification' = 'update',
  preprocess: (items: (T | U)[]) => U[] = items => items as unknown as U[],
  buffer = 10,
) {
  // called `next` method will mutate the internal state of the variable,
  // and we need its initial state after HMR
  // so clone it
  const paginator = _paginator.clone()

  const state = ref<PaginatorState>(isHydrated.value ? 'idle' : 'loading')
  const items = ref<U[]>([])
  const nextItems = ref<U[]>([])
  const prevItems = ref<T[]>([])

  const endAnchor = ref<HTMLDivElement>()
  const bound = useElementBounding(endAnchor)
  const isInScreen = computed(() => bound.top.value < window.innerHeight * 2)
  const error = ref<unknown | undefined>()
  const deactivated = useDeactivated()

  async function update() {
    (items.value as U[]).unshift(...preprocess(prevItems.value as T[]))
    prevItems.value = []
  }

  watch(stream, async (stream) => {
    if (!stream)
      return

    for await (const entry of stream) {
      if (entry.event === eventType) {
        const status = entry.payload

        if ('uri' in status)
          cacheStatus(status, undefined, true)

        const index = prevItems.value.findIndex((i: any) => i.id === status.id)
        if (index >= 0)
          prevItems.value.splice(index, 1)

        prevItems.value.unshift(status as any)
      }
      else if (entry.event === 'status.update') {
        const status = entry.payload
        cacheStatus(status, undefined, true)

        const data = items.value as mastodon.v1.Status[]
        const index = data.findIndex(s => s.id === status.id)
        if (index >= 0)
          data[index] = status
      }

      else if (entry.event === 'delete') {
        const id = entry.payload
        removeCachedStatus(id)

        const data = items.value as mastodon.v1.Status[]
        const index = data.findIndex(s => s.id === id)
        if (index >= 0)
          data.splice(index, 1)
      }
    }
  }, { immediate: true })

  async function loadNext() {
    if (state.value !== 'idle')
      return

    state.value = 'loading'
    try {
      const result = await paginator.next()

      if (!result.done && result.value.length) {
        const preprocessedItems = preprocess([...nextItems.value, ...result.value] as (U | T)[])
        const itemsToShowCount
          = preprocessedItems.length <= buffer
            ? preprocessedItems.length
            : preprocessedItems.length - buffer
        ;(nextItems.value as U[]) = preprocessedItems.slice(itemsToShowCount)
        ;(items.value as U[]).push(...preprocessedItems.slice(0, itemsToShowCount))
        state.value = 'idle'
      }
      else {
        items.value.push(...nextItems.value)
        nextItems.value = []
        state.value = 'done'
      }
    }
    catch (e) {
      console.error(e)

      error.value = e
      state.value = 'error'
    }

    await nextTick()
    bound.update()
  }

  if (import.meta.client) {
    useIntervalFn(() => {
      bound.update()
    }, 1000)

    if (!isHydrated.value) {
      onHydrated(() => {
        state.value = 'idle'
        loadNext()
      })
    }

    watchEffect(
      () => {
        if (
          isInScreen.value
          && state.value === 'idle'
          // No new content is loaded when the keepAlive page enters the background
          && deactivated.value === false
        ) {
          loadNext()
        }
      },
    )
  }

  return {
    items,
    prevItems,
    update,
    state,
    error,
    endAnchor,
  }
}
