<script lang="ts" setup>
import type { History } from 'masto/fetch'
import sparkline from '@fnando/sparkline'

const {
  history,
} = $defineProps<{
  history?: History[]
}>()

const historyNum = $computed(() => {
  if (!history)
    return [1, 1, 1, 1, 1, 1, 1]
  return [...history].reverse().map(item => Number(item.accounts) || 0)
})

const sparklineEl = $ref<SVGSVGElement>()

watch([$$(historyNum), $$(sparklineEl)], ([historyNum, sparklineEl]) => {
  if (!sparklineEl)
    return
  sparkline(sparklineEl, historyNum)
})
</script>

<template>
  <svg ref="sparklineEl" class="sparkline" width="60" height="40" stroke-width="3" />
</template>
