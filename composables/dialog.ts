import type { Draft } from './statusDrafts'
import { STORAGE_KEY_FIRST_VISIT, STORAGE_KEY_ZEN_MODE } from '~/constants'

enum OpenDialog {
  None,
  UserSwitcher,
  SigninDialog,
  PublishDialog,
  PreviewHelp,
}

export const isFirstVisit = useLocalStorage(STORAGE_KEY_FIRST_VISIT, true)
export const isZenMode = useLocalStorage(STORAGE_KEY_ZEN_MODE, false)
export const toggleZenMode = useToggle(isZenMode)

export const openDialog = ref<OpenDialog>(isFirstVisit.value ? OpenDialog.PreviewHelp : OpenDialog.None)
export const isUserSwitcherOpen = computed(() => openDialog.value === OpenDialog.UserSwitcher)
export const isSigninDialogOpen = computed(() => openDialog.value === OpenDialog.SigninDialog)
export const isPublishDialogOpen = computed(() => openDialog.value === OpenDialog.PublishDialog)
export const isPreviewHelpOpen = computed(() => openDialog.value === OpenDialog.PreviewHelp)

export function closeDialog() {
  openDialog.value = OpenDialog.None
}

export function openUserSwitcher() {
  openDialog.value = OpenDialog.UserSwitcher
}

export function openSigninDialog() {
  openDialog.value = OpenDialog.SigninDialog
}

export function openPreviewHelp() {
  openDialog.value = OpenDialog.PreviewHelp
}

export function openPublishDialog(draft?: Draft) {
  if (draft)
    dialogDraft.draft.value = draft
  openDialog.value = OpenDialog.PublishDialog
}

if (isPreviewHelpOpen.value) {
  watch(isPreviewHelpOpen, () => {
    isFirstVisit.value = false
  })
}
