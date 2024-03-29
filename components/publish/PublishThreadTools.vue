<script setup lang="ts">
const props = defineProps<{
  draftKey: string
}>()

const { threadIsActive, addThreadDraft, getThreadDraftIndex, threadLength,
} = useThreadComposer()

const isLastDraftInThread = computed(() => getThreadDraftIndex(props.draftKey).value === threadLength.value - 1)

function toggleThread() {
  // TODO what do on remove

  // Add a new draft to the current thread
  addThreadDraft()
}
</script>

<template>
  <div flex flex-row rounded-3 bg-border>
    <div
      v-if="threadIsActive" dir="ltr" pointer-events-none pe-1 pt-2 pl-2 text-sm tabular-nums text-secondary flex
      gap="0.5"
    >
      {{ getThreadDraftIndex(draftKey) }}<span text-secondary-light>/</span><span text-secondary-light>{{ threadLength
      }}</span>
    </div>

    <button btn-action-icon :aria-label="$t('tooltip.manage_thread')" @click="toggleThread">
      <div v-if="threadIsActive && !isLastDraftInThread" i-ri:chat-delete-line />
      <div v-else i-ri:chat-new-line />
    </button>
  </div>
</template>
