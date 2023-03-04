<script setup lang="ts">
defineProps<{
  /** Show the back button on small screens */
  backOnSmallScreen?: boolean
  /** Show the back button on both small and big screens */
  back?: boolean
  /** Do not applying overflow hidden to let use floatable components in title */
  noOverflowHidden?: boolean
}>()

const route = useRoute()
const wideLayout = computed(() => route.meta.wideLayout ?? false)
</script>

<template>
  <div>
    <div
      sticky top-0 z10 backdrop-blur
      pt="[env(safe-area-inset-top,0)]"
      border="b base" bg="[rgba(var(--rgb-bg-base),0.7)]"
      class="native:lg:w-[calc(100vw-5rem)] native:xl:w-[calc(135%+(100vw-1200px)/2)]"
    >
      <div flex justify-between px5 py2 :class="{ 'xl:hidden': $route.name !== 'tag' }" class="native:xl:flex">
        <div flex gap-3 items-center :overflow-hidden="!noOverflowHidden ? '' : false" py2 w-full>
          <NuxtLink
            v-if="backOnSmallScreen || back" flex="~ gap1" items-center btn-text p-0 xl:hidden
            :aria-label="$t('nav.back')"
            @click="$router.go(-1)"
          >
            <div i-ri:arrow-left-line class="rtl-flip" />
          </NuxtLink>
          <div :truncate="!noOverflowHidden ? '' : false" flex w-full data-tauri-drag-region class="native-mac:justify-center native-mac:text-center native-mac:sm:justify-start">
            <slot name="title" />
          </div>
          <div sm:hidden h-7 w-1px />
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
    <PwaInstallPrompt lg:hidden />
    <div :class="isHydrated && wideLayout ? 'xl:w-full sm:max-w-600px' : 'sm:max-w-600px md:shrink-0'" m-auto>
      <slot />
    </div>
  </div>
</template>
