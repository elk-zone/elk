import type { Attachment, StatusEdit } from 'masto'
import type { Draft } from './statusDrafts'
import { STORAGE_KEY_FIRST_VISIT, STORAGE_KEY_ZEN_MODE } from '~/constants'

export const mediaPreviewList = ref<Attachment[]>([])
export const mediaPreviewIndex = ref(0)

export const statusEdit = ref<StatusEdit>()
export const dialogDraftKey = ref<string>()

export const isFirstVisit = useLocalStorage(STORAGE_KEY_FIRST_VISIT, !process.mock)
export const isZenMode = useLocalStorage(STORAGE_KEY_ZEN_MODE, false)

export const isSigninDialogOpen = ref(false)
export const isPublishDialogOpen = ref(false)
export const isKeyboardShortcutsDialogOpen = ref(false)
export const isMediaPreviewOpen = ref(false)
export const isEditHistoryDialogOpen = ref(false)
export const isPreviewHelpOpen = ref(isFirstVisit.value)

export const toggleZenMode = useToggle(isZenMode)

export function openSigninDialog() {
  isSigninDialogOpen.value = true
}

export function openPublishDialog(draftKey = 'dialog', draft?: Draft, overwrite = false): void {
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
}

if (isPreviewHelpOpen.value) {
  watch(isPreviewHelpOpen, () => {
    isFirstVisit.value = false
  })
}

export function openMediaPreview(attachments: Attachment[], index = 0) {
  mediaPreviewList.value = attachments
  mediaPreviewIndex.value = index
  isMediaPreviewOpen.value = true
}

export function closeMediaPreview() {
  isMediaPreviewOpen.value = false
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

export function toggleKeyboardShortcuts() {
  isKeyboardShortcutsDialogOpen.value = !isKeyboardShortcutsDialogOpen.value
}

export function closeKeyboardShortcuts() {
  isKeyboardShortcutsDialogOpen.value = false
}
