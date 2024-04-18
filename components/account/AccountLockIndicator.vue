<script setup lang="ts">
defineProps<{
  showLabel?: boolean
}>()

const { t } = useI18n()
</script>

<template>
  <div
    flex="~ gap1" items-center
    :class="{ 'border border-base rounded-md px-1': showLabel }"
    text-secondary-light
  >
    <slot name="prepend" />
    <CommonTooltip content="Lock" :disabled="showLabel">
      <div i-ri:lock-line />
    </CommonTooltip>
    <div v-if="showLabel">
      {{ t('account.lock') }}
    </div>
  </div>
</template>
