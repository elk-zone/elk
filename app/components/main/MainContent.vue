<script setup lang="ts">
defineProps<{
  /** Show the back button on small screens */
  backOnSmallScreen?: boolean
  /** Show the back button on both small and big screens */
  back?: boolean
  /** Do not applying overflow hidden to let use floatable components in title */
  noOverflowHidden?: boolean
}>()

const container = ref()
const route = useRoute()
const userSettings = useUserSettings()
const { height: windowHeight } = useWindowSize()
const { height: containerHeight } = useElementBounding(container)
const wideLayout = computed(() => route.meta.wideLayout ?? false)
const sticky = computed(() => route.path?.startsWith('/settings/'))
const containerClass = computed(() => {
  // we keep original behavior when not in settings page and when the window height is smaller than the container height
  if (!isHydrated.value || !sticky.value || (windowHeight.value < containerHeight.value))
    return null

  return 'lg:sticky lg:top-0'
})
</script>

<template>
  <div ref="container" :class="containerClass">
    <div
      sticky top-0 z-20
      pt="[env(safe-area-inset-top,0)]"
      bg="[rgba(var(--rgb-bg-base),0.7)]"
      class="native:lg:w-[calc(100vw-5rem)] native:xl:w-[calc(135%+(100vw-1200px)/2)]"
      :class="{
        'backdrop-blur': !getPreferences(userSettings, 'optimizeForLowPerformanceDevice'),
      }"
    >
      <div flex justify-between gap-2 min-h-53px px5 py1 :class="{ 'xl:hidden': $route.name !== 'tag' }" class="native:xl:flex" border="b base">
        <div flex gap-2 items-center :overflow-hidden="!noOverflowHidden ? '' : false" w-full>
          <button
            v-if="backOnSmallScreen || back"
            btn-text flex items-center ms="-3" p-3 xl:hidden
            :aria-label="$t('nav.back')"
            @click="$router.go(-1)"
          >
            <div text-lg i-ri:arrow-left-line class="rtl-flip" />
          </button>
          <div :truncate="!noOverflowHidden ? '' : false" flex w-full data-tauri-drag-region class="native-mac:justify-start native-mac:text-center">
            <slot name="title" />
          </div>
          <div sm:hidden h-7 w-1px />
        </div>
        <div flex items-center flex-shrink-0 gap-x-2>
          <slot name="actions" />
          <PwaBadge xl:hidden />
          <NavUser v-if="isHydrated" />
          <NavUserSkeleton v-else />
        </div>
      </div>
      <slot name="header">
        <div hidden />
      </slot>
    </div>
    <PwaInstallPrompt xl:hidden />
    <div :class="isHydrated && wideLayout ? 'xl:w-full sm:max-w-600px' : 'sm:max-w-600px md:shrink-0'" m-auto>
      <div hidden :class="{ 'xl:block': $route.name !== 'tag' && !$slots.header }" h-6 />
      <slot />
    </div>
  </div>
</template>
