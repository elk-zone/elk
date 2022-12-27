<script setup lang="ts">
import type { Status } from 'masto'
const paginator = useMasto().timelines.iterateHome()
const stream = await useMasto().stream.streamUser()
onBeforeUnmount(() => stream.disconnect())

const maxDistance = 10
function preprocess(items: Status[]) {
  const newItems = [...items]
  // TODO: Basic reordering, we should get something more efficient and robust
  for (let i = items.length - 1; i > 0; i--) {
    for (let k = 1; k <= maxDistance && i - k >= 0; k++) {
      if (newItems[i - k].inReplyToId === newItems[i].id) {
        const item = newItems.splice(i, 1)[0]
        newItems.splice(i - k, 0, item)
        k = 1
      }
    }
  }
  return newItems
}
</script>

<template>
  <div>
    <PublishWidget draft-key="home" />
    <TimelinePaginator v-bind="{ paginator, stream, preprocess }" context="home" />
  </div>
</template>
