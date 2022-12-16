<script setup lang="ts">
import type { AriaLive } from '~/composables/aria/types'
import { useAriaLog } from '~/composables/aria'

const { title, heading = 'h2', ariaLive = 'polite' } = $defineProps<{
  title: string
  ariaLive?: AriaLive
  heading?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}>()

const { announceLogs, clearLogs, logs } = useAriaLog()

defineExpose({
  announceLogs,
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
          {{ log }}
        </li>
      </ul>
    </div>
  </div>
</template>
