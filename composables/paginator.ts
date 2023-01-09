import { Paginator } from 'masto'
import type { WsEvents, mastodon } from 'masto'
import type { PaginatorState } from '~/types'

export function usePaginator<T, P, U = T>(
  _paginator: Paginator<T[], P>,
  stream?: Promise<WsEvents>,
  eventType: 'notification' | 'update' = 'update',
  preprocess: (items: (T | U)[]) => U[] = items => items as unknown as U[],
  buffer = 10,
) {
  // TODO: wait PR https://github.com/neet/masto.js/pull/801
  // called `next` method will mutate the internal state of the variable, and we need its initial state after HMR
  // so clone it
  // @ts-expect-error clone it
  const paginator: Paginator<T[], P> = new Paginator(_paginator.http, _paginator.nextPath, _paginator.nextParams)

  const state = ref<PaginatorState>(isMastoInitialised.value ? 'idle' : 'loading')
  const items = ref<U[]>([])
  const nextItems = ref<U[]>([])
  const prevItems = ref<T[]>([])

  const endAnchor = ref<HTMLDivElement>()
  const bound = reactive(useElementBounding(endAnchor))
  const isInScreen = $computed(() => bound.top < window.innerHeight * 2)
  const error = ref<unknown | undefined>()
  const deactivated = useDeactivated()

  async function update() {
    (items.value as U[]).unshift(...preprocess(prevItems.value as T[]))
    prevItems.value = []
  }

  stream?.then((s) => {
    s.on(eventType, (status) => {
      if ('uri' in status)
        cacheStatus(status, undefined, true)

      const index = prevItems.value.findIndex((i: any) => i.id === status.id)
      if (index >= 0)
        prevItems.value.splice(index, 1)

      prevItems.value.unshift(status as any)
    })

    // TODO: update statuses
    s.on('status.update', (status) => {
      cacheStatus(status, undefined, true)

      const data = items.value as mastodon.v1.Status[]
      const index = data.findIndex(s => s.id === status.id)
      if (index >= 0)
        data[index] = status
    })

    s.on('delete', (id) => {
      removeCachedStatus(id)

      const data = items.value as mastodon.v1.Status[]
      const index = data.findIndex(s => s.id === id)
      if (index >= 0)
        data.splice(index, 1)
    })
  })

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
      error.value = e
      state.value = 'error'
    }

    await nextTick()
    bound.update()
  }

  if (process.client) {
    useIntervalFn(() => {
      bound.update()
    }, 1000)

    if (!isMastoInitialised.value) {
      onMastoInit(() => {
        state.value = 'idle'
        loadNext()
      })
    }

    watch(
      () => [isInScreen, state],
      () => {
        if (
          isInScreen
          && state.value === 'idle'
          // No new content is loaded when the keepAlive page enters the background
          && deactivated.value === false
        )
          loadNext()
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
