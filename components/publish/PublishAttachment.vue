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
    <status-attachment :attachment="attachment" w-full />
    <div absolute right-2 top-2 hover:bg="gray/40" transition-100 p-1 rounded-5 cursor-pointer op-0 group-hover:op-100>
      <div v-if="removable" i-ri:close-line text-3 @click="$emit('remove')" />
    </div>
  </div>
</template>
