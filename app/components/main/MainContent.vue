<script setup lang="ts">
const { back = false } = defineProps<{
  /**
   * Should we show a back button?
   * Note: this will be forced to false on xl screens to avoid duplicating the sidebar's back button.
   */
  back?: boolean | 'small-only'
  /** Show the back button on small screens */
  backOnSmallScreen?: boolean
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

const showBackButton = computed(() => {
  switch (back) {
    case 'small-only':
      return isSmallOrMediumScreen.value
    case true:
      return !isExtraLargeScreen.value
    default:
      return false
  }
})
</script>

<template>
  <div ref="container" :class="containerClass">
    <div
      sticky top-0 z-20
      pt="[env(safe-area-inset-top,0)]"
      bg="[rgba(var(--rgb-bg-base),0.7)]"
      :class="{
        'backdrop-blur': !getPreferences(userSettings, 'optimizeForLowPerformanceDevice'),
      }"
    >
      <div flex="~ justify-between" min-h-53px px-2 py-1 :class="{ 'xl:hidden': $route.name !== 'tag' }" border="b base">
        <div flex="~ items-center" w-full>
          <button
            v-if="backOnSmallScreen || showBackButton"
            btn-text flex items-center p-3 xl:hidden
            :aria-label="$t('nav.back')"
            @click="$router.go(-1)"
          >
            <div text-lg i-ri:arrow-left-line class="rtl-flip" />
          </button>
          <div flex w-full>
            <slot name="title" />
          </div>
          <div sm:hidden h-7 w-1px />
        </div>
        <div flex="~ items-center shrink-0 gap-x-2" px-3>
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
