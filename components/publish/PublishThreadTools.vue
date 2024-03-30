<script setup lang="ts">
const props = defineProps<{
  draftKey: string
  draftItemIndex: number
}>()

const { threadIsActive, addThreadItem, threadItems, removeThreadItem } = useThreadComposer(props.draftKey)

const isRemovableItem = computed(() => threadIsActive.value && props.draftItemIndex < threadItems.value.length - 1)

function addOrRemoveItem() {
  if (isRemovableItem.value)
    removeThreadItem(props.draftItemIndex)

  else
    addThreadItem()
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

    <button btn-action-icon :aria-label="$t('tooltip.manage_thread')" @click="addOrRemoveItem">
      <div v-if="isRemovableItem" i-ri:chat-delete-line />
      <div v-else i-ri:chat-new-line />
    </button>
  </div>
</template>
