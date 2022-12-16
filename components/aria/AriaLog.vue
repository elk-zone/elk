<script setup lang="ts">
import type { AriaLive } from '~/composables/aria/types'
import { useAriaLog } from '~/composables/aria'

// tsc complaining when using $defineProps
withDefaults(defineProps<{
  title: string
  ariaLive?: AriaLive
  heading?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}>(), {
  heading: 'h2',
  ariaLive: 'polite',
})

const { announceLogs, appendLogs, clearLogs, logs } = useAriaLog()

defineExpose({
  announceLogs,
  appendLogs,
  clearLogs,
})
</script>

<template>
  <slot />
  <div sr-only>
    <div role="log" :aria-live="ariaLive">
      <component :is="heading">
        {{ title }}
      </component>
      <ul>
        <li v-for="log in logs" :key="log">
          <slot name="log" :log="log">
            {{ log }}
          </slot>
        </li>
      </ul>
    </div>
  </div>
</template>
