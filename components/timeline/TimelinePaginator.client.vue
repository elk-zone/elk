<script setup lang="ts">
import type { Paginator, Status } from 'masto'

const { paginator } = defineProps<{
  paginator: Paginator<any, Status[]>
}>()

let isLoading = $ref(false)
let isDone = $ref(false)
const statuses = $ref<Status[]>([])

const endAnchor = ref<HTMLDivElement>()
const bound = reactive(useElementBounding(endAnchor))
const isInScreen = $computed(() => bound.top < window.innerHeight * 2)

async function loadNext() {
  if (isLoading || isDone)
    return

  // console.log('REQUEST')
  isLoading = true
  const result = await paginator.next()
  if (result.done)
    isDone = true
  if (result.value?.length)
    statuses.push(...result.value)
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
</script>

<template>
  <template v-for="status of statuses" :key="status.id">
    <StatusCard :status="status" border="t border" pt-4 />
  </template>
  <div ref="endAnchor" />
  <div v-if="isLoading">
    Loading...
  </div>
  <div v-if="isDone">
    End of list
  </div>
</template>
