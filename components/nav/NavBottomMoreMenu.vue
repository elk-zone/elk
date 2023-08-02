<script lang="ts" setup>
const modelValue = defineModel<boolean>({ required: true })
const colorMode = useColorMode()

const userSettings = useUserSettings()

function toggleVisible() {
  modelValue.value = !modelValue
}

const buttonEl = ref<HTMLDivElement>()
/** Close the drop-down menu if the mouse click is not on the drop-down menu button when the drop-down menu is opened */
function clickEvent(mouse: MouseEvent) {
  if (mouse.target && !buttonEl.value?.children[0].contains(mouse.target as any)) {
    if (modelValue) {
      document.removeEventListener('click', clickEvent)
      modelValue.value = false
    }
  }
}

function toggleDark() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

watch($$(modelValue), (val) => {
  if (val && typeof document !== 'undefined')
    document.addEventListener('click', clickEvent)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', clickEvent)
})
</script>

<template>
  <div ref="buttonEl" flex items-center static>
    <slot :toggle-visible="toggleVisible" :show="modelValue" />

    <!-- Drawer -->
    <Transition
      enter-active-class="transition duration-250 ease-out children:(transition duration-250 ease-out)"
      enter-from-class="opacity-0 children:(transform translate-y-full)"
      enter-to-class="opacity-100 children:(transform translate-y-0)"
      leave-active-class="transition duration-250 ease-in  children:(transition duration-250 ease-in)"
      leave-from-class="opacity-100 children:(transform translate-y-0)"
      leave-to-class="opacity-0 children:(transform translate-y-full)"
    >
      <div
        v-show="modelValue"
        absolute inset-x-0 top-auto bottom-full z-20 h-100vh
        flex items-end of-y-scroll of-x-hidden scrollbar-hide overscroll-none
        bg="black/50"
      >
        <!-- The style `scrollbar-hide overscroll-none overflow-y-scroll mb="-1px"` and `h="[calc(100%+0.5px)]"` is used to implement scroll locking, -->
        <!-- corresponding to issue: #106, so please don't remove it. -->
        <div absolute inset-0 opacity-0 h="[calc(100vh+0.5px)]" />
        <div

          flex-1 min-w-48 py-6 mb="-1px"
          of-y-auto scrollbar-hide overscroll-none max-h="[calc(100vh-200px)]"
          rounded-t-lg bg="white/85 dark:neutral-900/85" backdrop-filter backdrop-blur-md
          border-t-1 border-base
        >
          <!-- Nav -->
          <NavSide />

          <!-- Divider line -->
          <div border="neutral-300 dark:neutral-700 t-1" m="x-3 y-2" />

          <!-- Function menu -->
          <div flex="~ col gap2">
            <!-- Toggle Theme -->
            <button
              flex flex-row items-center
              block px-5 py-2 focus-blue w-full
              text-sm text-base capitalize text-left whitespace-nowrap
              transition-colors duration-200 transform
              hover="bg-gray-100 dark:(bg-gray-700 text-white)"
              @click="toggleDark()"
            >
              <span class="i-ri:sun-line dark:i-ri:moon-line flex-shrink-0 text-xl me-4 !align-middle" />
              {{ colorMode.value === 'light' ? $t('menu.toggle_theme.dark') : $t('menu.toggle_theme.light') }}
            </button>

            <!-- Zen Mode -->
            <button
              flex flex-row items-center
              block px-5 py-2 focus-blue w-full
              text-sm text-base capitalize text-left whitespace-nowrap
              transition-colors duration-200 transform
              hover="bg-gray-100 dark:(bg-gray-700 text-white)"
              :aria-label="$t('nav.zen_mode')"
              @click="togglePreferences('zenMode')"
            >
              <span :class="getPreferences(userSettings, 'zenMode') ? 'i-ri:layout-right-2-line' : 'i-ri:layout-right-line'" class="flex-shrink-0 text-xl me-4 !align-middle" />
              {{ $t('nav.zen_mode') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
