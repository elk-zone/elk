<script setup lang="ts">
import type { mastodon } from 'masto'
import type { DraftItem } from '~/types'

const {
  draftKey,
  initial = getDefaultDraftItem,
  expanded = false,
  placeholder,
  dialogLabelledBy,
  inReplyToId,
  inReplyToVisibility,
} = defineProps<{
  draftKey: string
  initial?: () => DraftItem
  placeholder?: string
  inReplyToId?: string
  inReplyToVisibility?: mastodon.v1.StatusVisibility
  expanded?: boolean
  dialogLabelledBy?: string
}>()

const threadItems = computed(() =>
  useThreadComposer(draftKey, initial).threadItems.value,
)

onDeactivated(() => {
  clearEmptyDrafts()
})

function isFirstItem(index: number) {
  return index === 0
}
</script>

<template>
  <template v-if="isHydrated && currentUser">
    <PublishWidget
      v-for="(_, index) in threadItems" :key="`${draftKey}-${index}`"
      :draft-key="draftKey"
      :draft-item-index="index"
      :expanded="isFirstItem(index) ? expanded : true"
      :placeholder="placeholder"
      :dialog-labelled-by="dialogLabelledBy"
      :in-reply-to-id="isFirstItem(index) ? inReplyToId : undefined"
      :in-reply-to-visibility="inReplyToVisibility"
    />
  </template>
</template>
