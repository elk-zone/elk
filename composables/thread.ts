import type { mastodon } from 'masto'
import type { DraftItem } from '~/types'

const maxThreadLength = 99

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
    if (draftItems.value.length >= maxThreadLength) {
      // TODO handle with error message that tells the user what's wrong
      // For now just fail silently without breaking anything
      return
    }

    const lastItem = draftItems.value[draftItems.value.length - 1]
    draftItems.value.push(getDefaultDraftItem({
      language: lastItem.params.language,
      sensitive: lastItem.params.sensitive,
      spoilerText: lastItem.params.spoilerText,
      visibility: lastItem.params.visibility,
    }))
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
    const allFailedMessages: Array<string> = []
    const isAReplyThread = Boolean(draftItems.value[0].params.inReplyToId)

    let lastPublishedStatus: mastodon.v1.Status | null = null
    let amountPublished = 0
    for (const draftItem of draftItems.value) {
      if (lastPublishedStatus)
        draftItem.params.inReplyToId = lastPublishedStatus.id

      const { publishDraft, failedMessages } = usePublish({
        draftItem: ref(draftItem),
        expanded: computed(() => true),
        isUploading: ref(false),
        initialDraft: () => draftItem,
        isPartOfThread: true,
      })

      const status = await publishDraft()
      if (status) {
        lastPublishedStatus = status
        amountPublished++
      }
      else {
        allFailedMessages.push(...failedMessages.value)
        // Stop publishing if one fails
        break
      }
    }
    // Remove all published items from the thread
    draftItems.value.splice(0, amountPublished)

    // If we have errors, return them
    if (allFailedMessages.length > 0)
      return allFailedMessages

    // If the thread was a reply and all items were published, jump to it
    if (isAReplyThread && lastPublishedStatus && draftItems.value.length === 0)
      navigateToStatus({ status: lastPublishedStatus })

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
