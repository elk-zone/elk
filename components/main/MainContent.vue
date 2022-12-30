<script setup lang="ts">
defineProps<{
  /** Show the back button on small screens */
  backOnSmallScreen?: boolean
  /** Show the back button on both small and big screens */
  back?: boolean
  largeHeader?: boolean
}>()
</script>

<template>
  <div relative :class="largeHeader ? 'mobile-padding-top-large-header' : 'mobile-padding-top'" sm:pt-0>
    <div
      fixed sm:sticky w-full top-0 z10
      border="b base" bg-base
    >
      <div flex justify-between px5 py4>
        <div flex gap-3 items-center overflow-hidden>
          <NuxtLink
            v-if="backOnSmallScreen || back" flex="~ gap1" items-center btn-text p-0
            :class="{ 'lg:hidden': backOnSmallScreen }"
            @click="$router.go(-1)"
          >
            <div i-ri:arrow-left-line />
          </NuxtLink>
          <div truncate>
            <slot name="title" />
          </div>
          <div h-7 w-1px />
        </div>
        <div flex items-center flex-shrink-0 gap-x-2>
          <slot name="actions" />
          <PwaBadge lg:hidden />
          <NavUser v-if="isMastoInitialised" />
        </div>
      </div>
      <slot name="header" />
    </div>
    <slot />
  </div>
</template>
