import type { Paginator } from 'masto'
import type { PaginatorState } from '~/types'

export function usePaginator<T>(paginator: Paginator<any, T[]>) {
  let state = $ref('ready' as PaginatorState)
  const items = $ref<T[]>([])

  const endAnchor = ref<HTMLDivElement>()
  const bound = reactive(useElementBounding(endAnchor))
  const isInScreen = $computed(() => bound.top < window.innerHeight * 2)

  async function loadNext() {
    if (state === 'loading' || state === 'done')
      return

    state = 'loading'
    const result = await paginator.next()
    state = result.done ? 'done' : 'ready'

    if (result.value?.length)
      items.push(...result.value)

    await nextTick()
    bound.update()
  }

  useIntervalFn(() => {
    bound.update()
  }, 1000)

  watch(
    () => isInScreen,
    () => {
      if (isInScreen && state !== 'loading')
        loadNext()
    },
    { immediate: true },
  )

  return { items, state, endAnchor }
}
