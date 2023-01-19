<script setup lang="ts">
const online = useOnline()
</script>

<template>
  <div
    v-if="!online"
    w-full min-h-30px px4 py3 text-primary bg-base
    border="t base" flex="~ gap-2 center"
  >
    <div i-ri:wifi-off-line />
    {{ $t('common.offline_desc') }}
  </div>
</template>
