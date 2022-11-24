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
export const isUserSwitcherOpen = computed({
  get() {
    return openDialog.value === OpenDialog.UserSwitcher
  },
  set(val: boolean) {
    if (val)
      openDialog.value = OpenDialog.UserSwitcher

    else
      openDialog.value = OpenDialog.None
  },
})
export const isSigninDialogOpen = computed({
  get() {
    return openDialog.value === OpenDialog.SigninDialog
  },
  set(val: boolean) {
    if (val)
      openDialog.value = OpenDialog.SigninDialog

    else
      openDialog.value = OpenDialog.None
  },
})
export const isPublishDialogOpen = computed({
  get() {
    return openDialog.value === OpenDialog.PublishDialog
  },
  set(val: boolean) {
    if (val)
      openDialog.value = OpenDialog.PublishDialog

    else
      openDialog.value = OpenDialog.None
  },
})
export const isPreviewHelpOpen = computed({
  get() {
    return openDialog.value === OpenDialog.PreviewHelp
  },
  set(val: boolean) {
    if (val)
      openDialog.value = OpenDialog.PreviewHelp

    else
      openDialog.value = OpenDialog.None
  },
})

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
