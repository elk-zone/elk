<script setup lang="ts">
const online = useOnline()
</script>

<template>
  <div
    v-if="!online"
    w-full min-h-30px p-2 bg-orange-500
    text-white bottom-0 sticky z-10
  >
    {{ $t('common.offline_desc') }}
  </div>
</template>
