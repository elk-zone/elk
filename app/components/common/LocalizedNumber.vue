<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

const { count } = defineProps<{
  count: number
  keypath: string
}>()

const { formatHumanReadableNumber, formatNumber, forSR } = useHumanReadableNumber()

const useSR = computed(() => forSR(count))
const rawNumber = computed(() => formatNumber(count))
const humanReadableNumber = computed(() => formatHumanReadableNumber(count))
</script>

<template>
  <i18n-t :keypath="keypath" :plural="count" tag="span" class="flex gap-x-1">
    <CommonTooltip v-if="useSR" :content="rawNumber" placement="bottom">
      <span aria-hidden="true" v-bind="$attrs">{{ humanReadableNumber }}</span>
      <span sr-only>{{ rawNumber }}</span>
    </CommonTooltip>
    <span v-else v-bind="$attrs">{{ humanReadableNumber }}</span>
  </i18n-t>
</template>
