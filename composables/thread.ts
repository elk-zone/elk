import type { DraftItem } from '~/types'

/**
 * The list of draft keys that are part of the thread.
 * There is a single global thread for the whole app, to keep complexity low.
 */
const threadItems: Ref<Array<DraftItem>> = ref([])

export function useThreadComposer(draftKey: string, initial?: () => DraftItem) {
  const { draftItems } = useDraft(draftKey, initial)

  /**
   * Whether the thread is active (has more than one item)
   */
  const threadIsActive = computed<boolean>(() => draftItems.value.length > 1)

  /**
   * Add an item to the thread
   */
  function addThreadItem() {
    draftItems.value.push(getDefaultDraftItem({}))
  }

  /**
   *
   * @param index index of the draft to remove from the thread
   */
  function removeThreadItem(index: number) {
    draftItems.value.splice(index, 1)
  }

  return {
    threadItems,
    threadIsActive,
    addThreadItem,
    removeThreadItem,
  }
}
