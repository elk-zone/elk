<script setup lang="ts">
import type { akkoma } from 'akko'

const { status } = defineProps<{
  status: akkoma.v1.Status
}>()

const visibility = computed(() => statusVisibilities.find(v => v.value === status.visibility)!)
</script>

<template>
  <CommonTooltip :content="$t(`visibility.${visibility.value}`)" placement="bottom">
    <div :class="visibility.icon" :aria-label="$t(`visibility.${visibility.value}`)" />
  </CommonTooltip>
</template>
