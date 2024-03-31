import type { mastodon } from 'masto'
import type { DraftItem } from '~/types'

const maxThreadLength = 99

const originalThreadIcon = '🧵'

const tiptapThreadIcon = ref(originalThreadIcon)

// use tiptap to generate the thread icon as HTML, which will enforce compatability with new and existing messages
useTiptap({
  content: tiptapThreadIcon,
  placeholder: ref(''),
  onSubmit: () => {},
  onFocus: () => {},
  onPaste: () => {},
  autofocus: true,
})

function getThreadStatusPrefix(position: number, totalAmount: number) {
  if (totalAmount === 1)
    return ''
  return `${tiptapThreadIcon.value} ${position}/${totalAmount} `
}

function updateThreadStatusPrefix(text: string, index: number, totalAmount: number) {
  return getThreadStatusPrefix(index, totalAmount) + text.replace(new RegExp(`${tiptapThreadIcon.value} \\d+/\\d+ `), '')
}

export function useThreadComposer(draftKey: string, initial?: () => DraftItem) {
  const { draftItems } = useDraft(draftKey, initial)

  // TODO find out why this didn't just work with a watcher on draftItems
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
      // TODO handle sanely
      throw new Error('Thread is too long')
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
    let lastPublishedStatus: mastodon.v1.Status | null = null
    let amountPublished = 0
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
        amountPublished++
      }
      else {
        // TODO handle error here somehow
        break
      }
    }

    // Remove all published items from the thread
    draftItems.value.splice(0, amountPublished)

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
