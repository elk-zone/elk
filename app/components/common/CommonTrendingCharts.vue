<script setup lang="ts">
import type { mastodon } from 'masto'
import sparkline from '@fnando/sparkline'

const {
  history,
  width = 60,
  height = 40,
} = defineProps<{
  history?: mastodon.v1.TagHistory[]
  width?: number
  height?: number
}>()

const historyNum = computed(() => {
  if (!history)
    return [1, 1, 1, 1, 1, 1, 1]
  return [...history].reverse().map(item => Number(item.accounts) || 0)
})

const sparklineEl = ref<SVGSVGElement>()
const sparklineFn = typeof sparkline !== 'function' ? (sparkline as any).default : sparkline

watch([historyNum, sparklineEl], ([historyNum, sparklineEl]) => {
  if (!sparklineEl)
    return
  sparklineFn(sparklineEl, historyNum)
})
</script>

<template>
  <svg ref="sparklineEl" class="sparkline" :width="width" :height="height" stroke-width="3" />
</template>
