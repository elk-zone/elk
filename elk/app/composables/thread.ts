import type { akkoma } from '@bdxtown/akko'
import type { DraftItem } from '#shared/types'

const maxThreadLength = 99

interface Leaf { node: akkoma.v1.Status, leafs: Leaf[] }

function traverse(sorted: akkoma.v1.Status[], leaf: Leaf) {
  if (leaf.node)
    sorted.push(leaf.node)
  leaf.leafs
    .forEach(l => traverse(sorted, l))
}

/**
 * Build a tree representation of the context sort status by deep traversing this tree -> this shows status sub-thread by sub-thread
 * @param status
 * @param statuses
 */
function sortDescendantsByReplies(status: akkoma.v1.Status, statuses: akkoma.v1.Status[]): akkoma.v1.Status[] {
  const refs: { [x: string]: Leaf } = statuses.reduce((acc, curr) => ({ ...acc, [curr.id]: { node: curr, leafs: [] } }), { [status.id as string]: { node: status, leafs: [] } })
  // const unrelated: akkoma.v1.Status[] = []
  Object.values(refs).forEach((leaf: Leaf) => {
    if (!leaf.node)
      return
    if (refs[leaf.node.inReplyToId!])
      refs[leaf.node.inReplyToId!].leafs.push(leaf)
    // else if (leaf.node.id !== status.id) we may want to keep those at some point
    //   unrelated.push(leaf.node)
  })
  const sorted: akkoma.v1.Status[] = []
  traverse(sorted, refs[status.id])
  return [...sorted.slice(1)]
}

/**
 * Only keep status that are actually a part of the current thread (starting from current status to original status)
 * @param status
 * @param statuses
 */
function sortAncestorsByReplies(status: akkoma.v1.Status, statuses: akkoma.v1.Status[]): akkoma.v1.Status[] {
  if (!status.inReplyToId)
    return []
  let last = status
  const sorted = []
  do {
    last = statuses.find(s => s.id === last?.inReplyToId)!
    sorted.push(last)
  } while (last.inReplyToId)
  return sorted.reverse()
}

export function sortContext(status: akkoma.v1.Status, context: akkoma.v1.Context): akkoma.v1.Context {
  const res = {
    ancestors: sortAncestorsByReplies(status, context.ancestors),
    descendants: sortDescendantsByReplies(status, context.descendants),
  }
  return res
}

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

    let lastPublishedStatus: akkoma.v1.Status | null = null
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
