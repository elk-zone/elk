import type { Paginator } from 'masto'

export function usePaginator<T>(paginator: Paginator<any, T[]>) {
  let isLoading = $ref(false)
  let isDone = $ref(false)
  const items = $ref<T[]>([])

  const endAnchor = ref<HTMLDivElement>()
  const bound = reactive(useElementBounding(endAnchor))
  const isInScreen = $computed(() => bound.top < window.innerHeight * 2)

  async function loadNext() {
    if (isLoading || isDone)
      return

    isLoading = true
    const result = await paginator.next()
    if (result.done)
      isDone = true
    if (result.value?.length)
      items.push(...result.value)
    isLoading = false
    await nextTick()
    bound.update()
  }

  useIntervalFn(() => {
    bound.update()
  }, 1000)

  watch(
    () => isInScreen,
    () => {
      if (isInScreen && !isLoading)
        loadNext()
    },
    { immediate: true },
  )

  return { items, isLoading, isDone, endAnchor }
}
