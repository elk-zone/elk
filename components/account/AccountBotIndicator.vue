<script setup lang="ts">
defineProps<{
  showLabel?: boolean
}>()
</script>

<template>
  <div
    flex="~ gap1" items-center
    :class="{ 'border border-base rounded-md px-1': showLabel }"
    text-secondary-light text-xs
  >
    <CommonTooltip :content="$t('account.bot')" :disabled="showLabel">
      <div i-ri:robot-line />
    </CommonTooltip>
    <div v-if="showLabel">
      {{ $t('account.bot') }}
    </div>
  </div>
</template>
