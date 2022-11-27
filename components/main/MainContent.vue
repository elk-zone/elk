<script setup lang="ts">
defineProps<{
  back?: boolean
}>()

const nav = ref<HTMLDivElement>()
</script>

<template>
  <div relative>
    <div
      ref="nav"
      sticky top-0 z10
      border="b base" bg-base
      :class="isZenMode ? 'op0 hover:op100 transition duration-300' : ''"
    >
      <div flex justify-between px5 py4>
        <div flex gap-3 items-center>
          <NuxtLink v-if="back" flex="~ gap1" items-center btn-text p-0 @click="$router.go(-1)">
            <div i-ri-arrow-left-line />
          </NuxtLink>
          <slot name="title" />
          <div h-7 w-1px />
        </div>
        <div flex items-center>
          <slot name="actions" />
          <NavUser v-if="isSmallScreen" :nav="nav" />
        </div>
      </div>
      <slot name="header" />
    </div>
    <slot />
  </div>
</template>
