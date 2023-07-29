<script setup lang="ts">
const info = useBuildInfo()
</script>

<template>
  <nav>
    <div hidden lg="h-full grid grid-rows-[minmax(0,93vh)_auto] gap-4 overflow-hidden">
      <div flex-auto />
      <div hidden lg="grid flex-col sticky bottom-0 bg-base h-fit">
        <PwaPrompt />
        <PwaInstallPrompt />
        <LazyCommonPreviewPrompt v-if="info.env === 'preview'" />
        <NavFooter />
      </div>
    </div>
  </nav>
</template>
