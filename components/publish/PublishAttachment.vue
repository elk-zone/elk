<script setup lang="ts">
import type { Attachment } from 'masto'

withDefaults(defineProps<{
  attachment: Attachment
  alt?: string
  removable?: boolean
}>(), {
  removable: true,
})

defineEmits<{
  (evt: 'remove'): void
}>()
</script>

<template>
  <div relative group>
    <StatusAttachment :attachment="attachment" w-full />
    <div absolute right-2 top-2>
      <div
        v-if="removable"
        aria-label="Remove attachment"
        hover:bg="gray/40" transition-100 p-1 rounded-5 cursor-pointer op-0 group-hover:op-100
        mix-blend-difference
        @click="$emit('remove')"
      >
        <div i-ri:close-line text-3 />
      </div>
    </div>
  </div>
</template>
