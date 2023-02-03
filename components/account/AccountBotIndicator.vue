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
    <CommonTooltip :content="$t('account.bot')" :disabled="showLabel">
      <div i-mdi:robot-outline />
    </CommonTooltip>
    <div v-if="showLabel">
      {{ $t('account.bot') }}
    </div>
  </div>
</template>
