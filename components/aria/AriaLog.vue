<script setup lang="ts">
import type { AriaLive } from '~/composables/aria'

const {
  ariaLive = 'polite',
  heading = 'h2',
  messageKey = (message: any) => message,
} = defineProps<{
  ariaLive?: AriaLive
  heading?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  title: string
  messageKey?: (message: any) => any
}>()

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
