<script setup lang="ts">
import type { AriaLive } from '~/composables/aria'

// tsc complaining when using $defineProps
withDefaults(defineProps<{
  title: string
  ariaLive?: AriaLive
  messageKey?: (message: any) => any
  heading?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}>(), {
  heading: 'h2',
  messageKey: (message: any) => message,
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
  <div sr-only role="log" :aria-live="ariaLive">
    <component :is="heading">
      {{ title }}
    </component>
    <ul>
      <li v-for="log in logs" :key="messageKey(log)">
        <slot name="log" :log="log">
          {{ log }}
        </slot>
      </li>
    </ul>
  </div>
</template>
