<script setup lang="ts">
// @ts-expect-error missing types
import { DynamicScrollerItem } from 'vue-virtual-scroller'
import type { Paginator, Status, WsEvents } from 'masto'

const { paginator, stream } = defineProps<{
  paginator: Paginator<any, Status[]>
  stream?: WsEvents
}>()

const virtualScroller = $(computedEager(() => useFeatureFlags().experimentalVirtualScroll))
const updater = ref()
const observer = new IntersectionObserver((entries) => {
  const [entry] = entries
  if (entry.isIntersecting) {
    observer.unobserve(entry.target)
    setTimeout(() => {
      (entry.target as HTMLButtonElement)?.click()
    }, 50)
  }
}, { threshold: 0.5 })

watch(updater, (v) => {
  if (v)
    observer.observe(v)
})
</script>

<template>
  <CommonPaginator v-bind="{ paginator, stream }" :virtual-scroller="virtualScroller">
    <template #updater="{ number, update }">
      <button
        v-if="number"
        ref="updater"
        style="background: repeating-linear-gradient(to right,var(--c-primary) 0%,var(--c-primary-active) 100%)"
        absolute h-1 w-full animate-pulse
        :aria-title="$t('timeline.show_new_items', [number])"
        @click="update"
      />
    </template>
    <template #default="{ item, active }">
      <template v-if="virtualScroller">
        <DynamicScrollerItem :item="item" :active="active" tag="article">
          <StatusCard :status="item" border="b base" py-3 />
        </DynamicScrollerItem>
      </template>
      <template v-else>
        <StatusCard :status="item" border="b base" py-3 />
      </template>
    </template>
    <template #loading>
      <StatusCardSkeleton border="b base" py-3 />
      <StatusCardSkeleton border="b base" py-3 op50 />
      <StatusCardSkeleton border="b base" py-3 op25 />
    </template>
  </CommonPaginator>
</template>
