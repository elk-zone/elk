<script setup lang="ts">
defineProps<{
  showLabel?: boolean
}>()
</script>

<template>
  <div
    flex="~ gap1" items-center
    :class="{ 'border border-base rounded-md px-1': showLabel }"
    text-secondary-light
  >
    <slot name="prepend" />
    <CommonTooltip no-auto-focus content="Lock" :disabled="showLabel">
      <div i-ri:lock-line />
    </CommonTooltip>
    <div v-if="showLabel">
      Lock
    </div>
  </div>
</template>
