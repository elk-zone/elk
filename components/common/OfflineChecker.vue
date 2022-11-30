<script setup lang="ts">
defineProps<{
  smallScreen: boolean
}>()
const online = useOnline()
</script>

<template>
  <div
    v-if="!online"
    w-full min-h-30px p-2 bg-orange-500
    text-white sticky z-10 :class="[smallScreen ? 'bottom-14' : 'bottom-0']"
  >
    {{ $t('common.offline_desc') }}
  </div>
</template>
