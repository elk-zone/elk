<script setup lang="ts">
import type { LineHeight } from '~/composables/settings'

const userSettings = useUserSettings()

const sizes = [
  {
    icon: 'i-ri-collapse-vertical-line',
    label: 'settings.interface.narrow',
    size: 'narrow',
  },
  {
    icon: 'i-ri-line-height',
    label: 'settings.interface.normal',
    size: 'normal',
  },
  {
    icon: 'i-ri-expand-vertical-line',
    label: 'settings.interface.wide',
    size: 'wide',
  },
] as const

const currentSize = computed(() => userSettings.value.lineHeight || sizes[1])

function setLineHeight(size: LineHeight) {
  userSettings.value.lineHeight = size
}
</script>

<template>
  <section space-y-2>
    <h2 id="interface-lh" font-medium>
      {{ $t('settings.interface.line_height') }}
    </h2>
    <p id="interface-lh-desc" pb-2>
      {{ $t('settings.interface.reload_app') }}
    </p>
    <div flex="~ gap4 wrap" p2 role="group" aria-labelledby="interface-lh" aria-describedby="interface-lh-desc">
      <button
        v-for="{ icon, label, size } in sizes"
        :key="size"
        type="button"
        btn-text flex-1 flex="~ gap-1 center" p4 border="~ base rounded" bg-base ws-nowrap
        :aria-pressed="currentSize === size ? 'true' : 'false'"
        :class="currentSize === size ? 'pointer-events-none' : 'filter-saturate-0'"
        @click="setLineHeight(size)"
      >
        <span :class="`${icon}`" />
        {{ $t(label) }}
      </button>
    </div>
  </section>
</template>
