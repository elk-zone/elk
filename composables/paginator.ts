import type { Paginator, WsEvents } from 'masto'
import { useDeactivated } from './lifecycle'
import type { PaginatorState } from '~/types'

export function usePaginator<T>(paginator: Paginator<any, T[]>, stream?: WsEvents) {
  const state = ref<PaginatorState>('idle')
  const items = ref<T[]>([])
  const nextItems = ref<T[]>([])
  const prevItems = ref<T[]>([])

  const endAnchor = ref<HTMLDivElement>()
  const bound = reactive(useElementBounding(endAnchor))
  const isInScreen = $computed(() => bound.top < window.innerHeight * 2)
  const error = ref<unknown | undefined>()
  const deactivated = useDeactivated()

  async function update() {
    items.value.unshift(...prevItems.value)
    prevItems.value = []
  }

  stream?.on('update', (status) => {
    prevItems.value.unshift(status as any)
  })

  // TODO: update statuses
  stream?.on('status.update', (status) => {
    const index = items.value.findIndex((s: any) => s.id === status.id)
    if (index >= 0)
      items.value[index] = status as any
  })

  async function loadNext() {
    if (state.value !== 'idle')
      return

    state.value = 'loading'
    try {
      const result = await paginator.next()

      if (result.value?.length) {
        nextItems.value = result.value
        items.value.push(...nextItems.value)
        state.value = 'idle'
      }
      else {
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

  useIntervalFn(() => {
    bound.update()
  }, 1000)

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
    { immediate: true },
  )

  return {
    items,
    prevItems,
    nextItems,
    update,
    state,
    error,
    endAnchor,
  }
}
