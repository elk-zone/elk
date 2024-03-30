<script setup lang="ts">
const props = defineProps<{
  draftKey: string
  draftItemIndex: number
}>()

const { threadIsActive, addThreadItem: addThreadDraft, threadItems,
} = useThreadComposer(props.draftKey)

const isLastDraftInThread = computed(() => props.draftItemIndex === threadItems.value.length - 1)

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
      {{ draftItemIndex + 1 }}<span text-secondary-light>/</span><span text-secondary-light>{{ threadItems.length
      }}</span>
    </div>

    <button btn-action-icon :aria-label="$t('tooltip.manage_thread')" @click="toggleThread">
      <div v-if="threadIsActive && !isLastDraftInThread" i-ri:chat-delete-line />
      <div v-else i-ri:chat-new-line />
    </button>
  </div>
</template>
