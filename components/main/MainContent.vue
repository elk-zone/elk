<script setup lang="ts">
defineProps<{
  back?: boolean
}>()
</script>

<template>
  <div relative>
    <div
      sticky top-0 z10
      border="b base" bg-base
    >
      <div flex justify-between px5 py4>
        <div flex gap-3 items-center overflow-hidden>
          <NuxtLink v-if="back" flex="~ gap1" items-center btn-text p-0 @click="$router.go(-1)">
            <div i-ri:arrow-left-line />
          </NuxtLink>
          <div truncate>
            <slot name="title" />
          </div>
          <div h-7 w-1px />
        </div>
        <div flex items-center flex-shrink-0 gap-x-2>
          <slot name="actions" />
          <NavUser v-if="isHydrated" />
        </div>
      </div>
      <slot name="header" />
    </div>
    <slot />
  </div>
</template>
