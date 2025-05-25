<script setup lang="ts">
const modelValue = defineModel<boolean>({ required: true })

const userSettings = useUserSettings()

const drawerEl = ref<HTMLDivElement>()

const toggleVisible = useThrottleFn(() => {
  modelValue.value = !modelValue.value
}, 200)

const buttonEl = ref<HTMLDivElement>()
/**
 * Close the drop-down menu if the mouse click is not on the drop-down menu button when the drop-down menu is opened
 * @param mouse
 */
function clickEvent(mouse: MouseEvent) {
  if (mouse.target && !buttonEl.value?.children[0].contains(mouse.target as any)) {
    if (modelValue.value) {
      document.removeEventListener('click', clickEvent)
      modelValue.value = false
    }
  }
}

watch(modelValue, (val) => {
  if (val && typeof document !== 'undefined') {
    document.addEventListener('click', clickEvent)
  }
})

onUpdated(() => {
  drawerEl.value?.scrollTo(0, 0)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', clickEvent)
})
</script>

<template>
  <div ref="buttonEl" flex items-center static>
    <slot :toggle-visible="toggleVisible" :show="modelValue" />
    <div
      v-show="modelValue"
      absolute inset-x-0 top-auto bottom-full h-100vh
      flex items-end of-y-scroll of-x-hidden scrollbar-hide overscroll-none
      bg="black/50"
    >
      <div
        ref="drawerEl"
        class="max-h[calc(100dvh-130px)] up"
        :class="{
          'backdrop-filter backdrop-blur-md': !getPreferences(userSettings, 'optimizeForLowPerformanceDevice'),
        }"
        flex-1 min-w-48 py-6
        of-y-auto scrollbar-hide overscroll-none
        rounded-t-lg
        bg="white/85 dark:neutral-900/85"
        backdrop-filter
        border-t-1
        border-base
      >
        <!-- Nav -->
        <div px-2>
          <NavSide />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes up {
  0% {
    transform: translateY(100%);
  }

  100% {
    transform: translateY(0);
  }
}

.up {
  animation: 200ms ease both up;
}
</style>
