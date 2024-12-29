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
      <div text-right p-2 class="bg-opacity-10 bg-white rounded-t">
        <button
          :aria-label="$t('attachment.remove_label')"
          class="bg-black/75 hover:bg-red/75"
          text-white px2 py2 rounded-full cursor-pointer
          @click="$emit('remove')"
        >
          <div i-ri:close-line text-3 text-6 md:text-3 />
        </button>
      </div>
      <StatusCard
        class="bg-border rounded-b"
        :status="quote"
        :actions="false"
        :hover="false"
        :is-preview="true"
      />
    </template>
    <div v-else mx-auto i-ri:loader-2-fill animate-spin />
  </div>
</template>
