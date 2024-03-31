import type { mastodon } from 'masto'
import type { DraftItem } from '~/types'

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
    // TODO pass settings of prior message to others as default
    draftItems.value.push(getDefaultDraftItem({ }))
  }

  /**
   *
   * @param index index of the draft to remove from the thread
   */
  function removeThreadItem(index: number) {
    draftItems.value.splice(index, 1)
  }

  /**
   * Publish all items in the thread in order
   */
  async function publishThread() {
    let lastPublishedStatus: mastodon.v1.Status | null = null
    for (const draftItem of draftItems.value) {
      if (lastPublishedStatus)
        draftItem.params.inReplyToId = lastPublishedStatus.id

      const { publishDraft } = usePublish({
        draftItem: ref(draftItem),
        expanded: computed(() => true),
        isUploading: ref(false),
        initialDraft: () => draftItem,
      })

      const status = await publishDraft()
      if (status) {
        lastPublishedStatus = status
      }
      else {
        // TODO handle error here somehow
        break
      }
    }

    return lastPublishedStatus
  }

  return {
    threadItems: draftItems,
    threadIsActive,
    addThreadItem,
    removeThreadItem,
    publishThread,
  }
}
