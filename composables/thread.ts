import type { mastodon } from 'masto'
import type { DraftItem } from '~/types'

const maxThreadLength = 99
/**
 * TODO: This is a hardcoded workaround, but it seems to work reliably.
 * We should definitely look into the emoji handling of tiptap a bit more and make this work better in the future.
 */
const threadIcon = '<img alt="🧵" src="/emojis/twemoji/1f9f5.svg" class="iconify-emoji iconify-emoji--twemoji">'

function getThreadStatusPrefix(position: number, totalAmount: number) {
  if (totalAmount === 1)
    return ''
  return `${threadIcon} ${position}/${totalAmount} `
}

function updateThreadStatusPrefix(text: string, index: number, totalAmount: number) {
  return getThreadStatusPrefix(index, totalAmount) + text.replace(new RegExp(`${threadIcon} \\d+/\\d+ `), '')
}

export function useThreadComposer(draftKey: string, initial?: () => DraftItem) {
  const { draftItems } = useDraft(draftKey, initial)

  function updateDraftItemAmount() {
    const totalLength = draftItems.value.length
    draftItems.value.forEach((draftItem, index) => {
      draftItem.params.status = updateThreadStatusPrefix(draftItem.params.status || '', index + 1, totalLength)
    })
  }

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
    updateDraftItemAmount()
  }

  /**
   *
   * @param index index of the draft to remove from the thread
   */
  function removeThreadItem(index: number) {
    draftItems.value.splice(index, 1)
    updateDraftItemAmount()
  }

  /**
   * Publish all items in the thread in order
   */
  async function publishThread() {
    const allFailedMessages: Array<string> = []

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
