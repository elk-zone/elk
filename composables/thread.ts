import type { Draft } from '~/types'

/**
 * The list of draft keys that are part of the thread.
 * There is a single global thread for the whole app, to keep complexity low.
 */
const threadDrafts: Ref<Record<string, Ref<Draft>>> = ref({})

// TODO remove debug info
watch(threadDrafts, (value) => {
  console.log('threadDrafts', value)
}, { immediate: true })

const threadBaseDraftKey = ref<string>()

export function useThreadComposer(baseDraftKey?: string) {
  if (baseDraftKey)
    threadBaseDraftKey.value = baseDraftKey

  /**
   * Current length of the thread
   */
  const threadLength = computed<number>(() => Object.keys(threadDrafts.value).length)

  /**
   * Whether the thread is active (has at least one draft)
   */
  const threadIsActive = computed<boolean>(() => threadLength.value > 1)

  /**
   * Add a draft to the thread
   * @param forcedDraftKey
   * @param draft
   */
  function addThreadDraft(forcedDraftKey?: string) {
    const draftKey = (`${threadBaseDraftKey.value ?? ''}--thread--${threadLength.value}`)
    threadDrafts.value[forcedDraftKey ?? draftKey] = ref(getDefaultDraft({}))
  }

  /**
   *
   * @param index index of the draft to remove from the thread
   */
  function removeThreadDraft(draftKey: string) {
    delete threadDrafts.value[draftKey]
  }

  function getThreadDraft(draftKey: string) {
    return threadDrafts.value[draftKey]
  }

  const threadDraftKeys = computed(() => {
    return Object.keys(threadDrafts.value)
  })

  function getThreadDraftIndex(draftKey: string) {
    return computed(() => threadDraftKeys.value.indexOf(draftKey))
  }

  async function publishThread() {
    const publishFunctions = Object.values(threadDrafts.value).map((draft) => {
      const isUploading = ref(false)
      const isEmpty = computed(() => isEmptyDraft(draft.value))
      const { publishDraft } = usePublish({
        draftState: { draft, isEmpty },
        isUploading,
        expanded: ref(false),
        initialDraft: ref(() => draft.value,
        ),
      })

      return publishDraft
    })

    // TODO check option for concurrency, but prob due to needing to always answer to the previous one, it needs to be sequential
    for (const publish of publishFunctions)
      await publish()
  }

  return {
    threadDrafts,
    threadDraftKeys,
    threadLength,
    threadIsActive,
    addThreadDraft,
    removeThreadDraft,
    getThreadDraft,
    getThreadDraftIndex,
    publishThread,
  }
}
