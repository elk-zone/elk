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
        <div flex gap-3 items-center>
          <NuxtLink v-if="back" flex="~ gap1" items-center btn-text p-0 @click="$router.go(-1)">
            <div i-ri:arrow-left-line />
          </NuxtLink>
          <div line-clamp-1>
            <slot name="title" />
          </div>
          <div flex items-center shrink-0>
            <slot name="actions" />
            <NavUser v-if="isMediumScreen" />
          </div>
        </div>
      </div>
      <slot name="header" />
    </div>
    <slot />
  </div>
</template>
