<script setup lang="ts">
import type { Status } from 'masto'
const paginator = useMasto().timelines.iterateHome()
const stream = useMasto().stream.streamUser()
onBeforeUnmount(() => stream?.then(s => s.disconnect()))

const maxDistance = 10
function preprocess(items: Status[]) {
  const newItems = [...items]
  // TODO: Basic reordering, we should get something more efficient and robust
  for (let i = items.length - 1; i > 0; i--) {
    for (let k = 1; k <= maxDistance && i - k >= 0; k++) {
      const inReplyToId = newItems[i - k].inReplyToId // TODO: ?? newItems[i - k].reblog?.inReplyToId
      if (inReplyToId === newItems[i].reblog?.id || inReplyToId === newItems[i].id) {
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
    <PublishWidget draft-key="home" border="b base" />
    <TimelinePaginator v-bind="{ paginator, stream, preprocess }" context="home" />
  </div>
</template>
