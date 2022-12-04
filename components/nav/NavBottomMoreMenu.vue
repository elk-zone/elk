<script lang="ts" setup>
import type { ComputedRef } from 'vue'
import type { LocaleObject } from '#i18n'

const props = defineProps<{
  modelValue?: boolean
}>()
const emits = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
}>()
const visible = useVModel(props, 'modelValue', emits, { passive: true })

const { t, locale, setLocale } = useI18n()
const { locales } = useI18n() as { locales: ComputedRef<LocaleObject[]> }

const toggleLocales = () => {
  const codes = locales.value.map(item => item.code)
  setLocale(codes[(codes.indexOf(locale.value) + 1) % codes.length])
}

function changeShow() {
  visible.value = !visible.value
}

const buttonEl = ref<HTMLDivElement>()
/** Close the drop-down menu if the mouse click is not on the drop-down menu button when the drop-down menu is opened */
function clickEvent(mouse: MouseEvent) {
  if (mouse.target && !buttonEl.value?.children[0].contains(mouse.target as any)) {
    if (visible.value) {
      document.removeEventListener('click', clickEvent)
      visible.value = false
    }
  }
}

watch(visible, (val, oldVal) => {
  if (val && val !== oldVal) {
    if (!import.meta.env.SSR && typeof document !== 'undefined')
      document.addEventListener('click', clickEvent)
  }
}, { flush: 'post' })

onBeforeUnmount(() => {
  if (!import.meta.env.SSR)
    document.removeEventListener('click', clickEvent)
})
</script>

<template>
  <div ref="buttonEl" flex items-center static>
    <slot :change-show="changeShow" :show="visible" />

    <!-- Drawer -->
    <Transition
      enter-active-class="transition duration-250 ease-out children:(transition duration-250 ease-out)"
      enter-from-class="opacity-0 children:(transform translate-y-full)"
      enter-to-class="opacity-100 children:(transform translate-y-0)"
      leave-active-class="transition duration-250 ease-in  children:(transition duration-250 ease-in)"
      leave-from-class="opacity-100 children:(transform translate-y-0)"
      leave-to-class="opacity-0 children:(transform translate-y-full)"
      persisted
    >
      <div
        v-show="visible"
        class="scrollbar-hide"
        absolute inset-x-0 top-auto bottom-full z-20 h-100vh
        flex items-end of-y-scroll of-x-hidden overscroll-none
        bg="black/50"
      >
        <!-- The style `scrollbar-hide overscroll-none overflow-y-scroll mb="-1px"` and `h="[calc(100%+0.5px)]"` is used to implement scroll locking, -->
        <!-- corresponding to issue: #106, so please don't remove it. -->
        <div absolute inset-0 opacity-0 h="[calc(100vh+0.5px)]" />
        <div
          class="scrollbar-hide"
          flex-1 min-w-48 py-8 mb="-1px"
          overflow-y-auto overscroll-none max-h="[calc(100vh-200px)]"
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
              <span class="i-ri:sun-line dark:i-ri:moon-line flex-shrink-0 text-xl mr-4 !align-middle" />
              {{ !isDark ? t('menu.toggle_theme.dark') : t('menu.toggle_theme.light') }}
            </button>
            <!-- Switch languages -->
            <NavSelectLanguage>
              <button
                flex flex-row items-center
                block px-5 py-2 focus-blue w-full
                text-sm text-base capitalize text-left whitespace-nowrap
                transition-colors duration-200 transform
                hover="bg-gray-100 dark:(bg-gray-700 text-white)"
                @click.stop
              >
                <span class="i-ri:earth-line flex-shrink-0 text-xl mr-4 !align-middle" />
                {{ $t('nav_footer.select_language') }}
              </button>
            </NavSelectLanguage>
            <!-- Toggle Feature Flags -->
            <NavSelectFeatureFlags v-if="currentUser">
              <button
                flex flex-row items-center
                block px-5 py-2 focus-blue w-full
                text-sm text-base capitalize text-left whitespace-nowrap
                transition-colors duration-200 transform
                hover="bg-gray-100 dark:(bg-gray-700 text-white)"
                @click.stop
              >
                <span class="i-ri:flag-line flex-shrink-0 text-xl mr-4 !align-middle" />
                {{ $t('nav_footer.select_feature_flags') }}
              </button>
            </NavSelectFeatureFlags>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.scrollbar-hide {
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
