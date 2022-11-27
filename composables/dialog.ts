import type { StatusEdit } from 'masto'
import type { Draft } from './statusDrafts'
import { STORAGE_KEY_FIRST_VISIT, STORAGE_KEY_ZEN_MODE } from '~/constants'

export const imagePreview = ref({ src: '', alt: '' })
export const statusEdit = ref<StatusEdit>()
export const isFirstVisit = useLocalStorage(STORAGE_KEY_FIRST_VISIT, true)
export const isZenMode = useLocalStorage(STORAGE_KEY_ZEN_MODE, false)
export const toggleZenMode = useToggle(isZenMode)

export const isSigninDialogOpen = ref(false)
export const isPublishDialogOpen = ref(false)
export const isImagePreviewDialogOpen = ref(false)
export const isEditHistoryDialogOpen = ref(false)
export const isPreviewHelpOpen = ref(isFirstVisit.value)

export function openSigninDialog() {
  isSigninDialogOpen.value = true
}

export function openPublishDialog(draft?: Draft) {
  if (draft)
    dialogDraft.draft.value = draft
  isPublishDialogOpen.value = true
}

if (isPreviewHelpOpen.value) {
  watch(isPreviewHelpOpen, () => {
    isFirstVisit.value = false
  })
}

export function openImagePreviewDialog(image: { src: string; alt: string }) {
  imagePreview.value = image
  isImagePreviewDialogOpen.value = true
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
