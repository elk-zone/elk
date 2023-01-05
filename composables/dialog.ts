import type { Attachment, Status, StatusEdit } from 'masto'
import type { Draft } from '~/types'
import { STORAGE_KEY_FIRST_VISIT, STORAGE_KEY_ZEN_MODE } from '~/constants'

export const mediaPreviewList = ref<Attachment[]>([])
export const mediaPreviewIndex = ref(0)

export const statusEdit = ref<StatusEdit>()
export const dialogDraftKey = ref<string>()

export const commandPanelInput = ref('')

export const isFirstVisit = useLocalStorage(STORAGE_KEY_FIRST_VISIT, !process.mock)
export const isZenMode = useLocalStorage(STORAGE_KEY_ZEN_MODE, false)

export const isSigninDialogOpen = ref(false)
export const isPublishDialogOpen = ref(false)
export const isMediaPreviewOpen = ref(false)
export const isEditHistoryDialogOpen = ref(false)
export const isPreviewHelpOpen = ref(isFirstVisit.value)
export const isCommandPanelOpen = ref(false)

export const lastPublishDialogStatus = ref<Status | null>(null)

export const toggleZenMode = useToggle(isZenMode)

export function openSigninDialog() {
  isSigninDialogOpen.value = true
}

export async function openPublishDialog(draftKey = 'dialog', draft?: Draft, overwrite = false): Promise<void> {
  dialogDraftKey.value = draftKey

  if (draft) {
    if (overwrite && !isEmptyDraft(currentUserDrafts.value[draftKey])) {
      // TODO overwrite warning
      // TODO don't overwrite, have a draft list
      if (process.dev) {
        // eslint-disable-next-line no-alert
        const result = confirm('[DEV] Are you sure you overwrite draft content?')
        if (!result)
          return
      }
    }

    if (overwrite || !currentUserDrafts.value[draftKey])
      currentUserDrafts.value[draftKey] = draft
  }
  isPublishDialogOpen.value = true

  await until(isPublishDialogOpen).toBe(false)
}

if (isPreviewHelpOpen.value) {
  watch(isPreviewHelpOpen, () => {
    isFirstVisit.value = false
  })
}

function restoreMediaPreviewFromState() {
  mediaPreviewList.value = JSON.parse(history.state?.mediaPreviewList ?? '[]')
  mediaPreviewIndex.value = history.state?.mediaPreviewIndex ?? 0
  isMediaPreviewOpen.value = history.state?.mediaPreview ?? false
}

if (process.client) {
  window.addEventListener('popstate', restoreMediaPreviewFromState)

  restoreMediaPreviewFromState()
}

export function openMediaPreview(attachments: Attachment[], index = 0) {
  mediaPreviewList.value = attachments
  mediaPreviewIndex.value = index
  isMediaPreviewOpen.value = true

  history.pushState({
    ...history.state,
    mediaPreview: true,
    mediaPreviewList: JSON.stringify(attachments),
    mediaPreviewIndex: index,
  }, '')
}

export function closeMediaPreview() {
  history.back()
}

export function openEditHistoryDialog(edit: StatusEdit) {
  statusEdit.value = edit
  isEditHistoryDialogOpen.value = true
}

export function openPreviewHelp() {
  isPreviewHelpOpen.value = true
}

export function closePreviewHelp() {
  isPreviewHelpOpen.value = false
}

export function openCommandPanel(isCommandMode = false) {
  commandPanelInput.value = isCommandMode ? '>' : ''
  isCommandPanelOpen.value = true
}

export function closeCommandPanel() {
  isCommandPanelOpen.value = false
}
