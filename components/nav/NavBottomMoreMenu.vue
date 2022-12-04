<script lang="ts" setup>
import type { ComputedRef } from 'vue'
import type { LocaleObject } from '#i18n'

const { t, locale, setLocale } = useI18n()
const { locales } = useI18n() as { locales: ComputedRef<LocaleObject[]> }

const toggleLocales = () => {
  const codes = locales.value.map(item => item.code)
  setLocale(codes[(codes.indexOf(locale.value) + 1) % codes.length])
}

const show = ref(false)
function changeShow() {
  show.value = !show.value
}

const buttonEl = ref<HTMLDivElement>()
/** Close the drop-down menu if the mouse click is not on the drop-down menu button when the drop-down menu is opened */
function clickEvent(mouse: MouseEvent) {
  if (mouse.target && !buttonEl.value?.children[0].contains(mouse.target as any)) {
    if (show.value) {
      document.removeEventListener('click', clickEvent)
      show.value = false
    }
  }
}

watch(show, (val, oldVal) => {
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
  <div ref="buttonEl" class="flex items-center static">
    <slot :change-show="changeShow" :show="show" />

    <!-- Drawer -->
    <Transition
      enter-active-class="transition duration-250 ease-out"
      enter-from-class="transform translate-y-full opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-250 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform translate-y-full opacity-0"
      persisted
    >
      <div
        v-show="show"
        class="
          absolute inset-x-0 top-auto bottom-full z-20
          min-w-48 py-2
          overflow-y-auto overscroll-none scrollbar-hide max-h-[calc(100vh-200px)]
          rounded-t-lg shadow-none bg-base
          border-y-1 border-base
        "
      >
        <ClientOnly>
          <!-- Nav -->
          <NavSide />

          <!-- Divider line -->
          <div class="*border-lv2" border="t-1" m="x-3 y-2" />

          <!-- Function menu -->
          <button
            class="
              flex flex-row items-center
              block px-4 py-3 focus-blue w-full
              text-sm text-base capitalize text-left whitespace-nowrap
              transition-colors duration-200 transform
            "
            hover="bg-gray-100 dark:(bg-gray-700 text-white)"
            @click="toggleDark()"
          >
            <span class="i-ri:sun-line dark:i-ri:moon-line flex-shrink-0 text-xl mr-4 !align-middle" />
            {{ !isDark ? t('button.toggle_dark') : t('button.toggle_light') }}
          </button>
          <!-- 切换语言 -->
          <button
            class="
              flex flex-row items-center
              block px-4 py-3 focus-blue w-full
              text-sm text-base capitalize text-left whitespace-nowrap
              transition-colors duration-200 transform
            "
            hover="bg-gray-100 dark:(bg-gray-700 text-white)"
            @click.stop="toggleLocales"
          >
            <span class="i-carbon:language flex-shrink-0 text-xl mr-4 !align-middle" />
            {{ t('button.toggle_langs') }}
          </button>
        </ClientOnly>
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
