<script setup lang="ts">
defineProps<{
  /** Show the back button on small screens */
  backOnSmallScreen?: boolean
  /** Show the back button on both small and big screens */
  back?: boolean
}>()
</script>

<template>
  <div>
    <div
      sticky top-0 z10 backdrop-blur
      pt="[env(safe-area-inset-top,0)]"
      border="b base" bg="[rgba(var(--rbg-bg-base),0.7)]"
    >
      <div flex justify-between px5 py2 :class="{ 'xl:hidden': $route.name !== 'tag' }" data-tauri-drag-region>
        <div flex gap-3 items-center overflow-hidden py2>
          <NuxtLink
            v-if="backOnSmallScreen || back" flex="~ gap1" items-center btn-text p-0 xl:hidden
            :aria-label="$t('nav.back')"
            @click="$router.go(-1)"
          >
            <div i-ri:arrow-left-line class="rtl-flip" />
          </NuxtLink>
          <div truncate>
            <slot name="title" />
          </div>
          <div h-7 w-1px />
        </div>
        <div flex items-center flex-shrink-0 gap-x-2>
          <slot name="actions" />
          <PwaBadge lg:hidden />
          <NavUser v-if="isHydrated" />
          <NavUserSkeleton v-else />
        </div>
      </div>
      <slot name="header" />
    </div>
    <div :class="{ 'xl:block': $route.name !== 'tag' }" hidden h-6 />
    <slot />
  </div>
</template>
