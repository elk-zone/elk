<script setup lang="ts">
const { draftKey, draftItemIndex } = defineProps<{
  draftKey: string
  draftItemIndex: number
}>()

const { threadIsActive, addThreadItem, threadItems, removeThreadItem } = useThreadComposer(draftKey)

const isRemovableItem = computed(() => threadIsActive.value && draftItemIndex < threadItems.value.length - 1)

function addOrRemoveItem() {
  if (isRemovableItem.value)
    removeThreadItem(draftItemIndex)

  else
    addThreadItem()
}

const { t } = useI18n()

const label = computed(() => {
  if (!isRemovableItem.value && draftItemIndex === 0)
    return t('tooltip.start_thread')

  return isRemovableItem.value ? t('tooltip.remove_thread_item') : t('tooltip.add_thread_item')
})
</script>

<template>
  <div flex flex-row rounded-3 :class="{ 'bg-border': threadIsActive }">
    <div
      v-if="threadIsActive" dir="ltr" pointer-events-none pe-1 pt-2 pl-2 text-sm tabular-nums text-secondary flex
      gap="0.5"
    >
      {{ draftItemIndex + 1 }}<span text-secondary-light>/</span><span text-secondary-light>{{ threadItems.length
      }}</span>
    </div>
    <CommonTooltip placement="top" :content="label">
      <button btn-action-icon :aria-label="label" @click="addOrRemoveItem">
        <div v-if="isRemovableItem" i-ri:chat-delete-line />
        <div v-else i-ri:chat-new-line />
      </button>
    </CommonTooltip>
  </div>
</template>
