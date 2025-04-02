<script lang="ts" setup>
import type { akkoma } from '@bdxtown/akko'

const { quote } = defineProps<{
  quote: akkoma.v1.Status | undefined
}>()

defineEmits<{
  (evt: 'remove'): void
}>()
</script>

<template>
  <div relative>
    <template v-if="quote">
      <div px-2 pt-2 bg-opacity-10 bg-card rounded-t flex justify-between>
        <div text-secondary i-ri:double-quotes-l />
        <button
          text-4
          :aria-label="$t('attachment.remove_label')"
          class="bg-black/30 hover:bg-black/40"
          text-white p1 rounded-full cursor-pointer
          @click="$emit('remove')"
        >
          <div i-ri:close-line />
        </button>
      </div>
      <StatusCard
        class="rounded-b bg-card"
        :status="quote"
        :actions="false"
        :hover="false"
        :is-preview="true"
        :in-quote="true"
      />
    </template>
    <div v-else mx-auto i-ri:loader-2-fill animate-spin />
  </div>
</template>
