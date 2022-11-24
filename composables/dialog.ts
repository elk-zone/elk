import type { Draft } from './statusDrafts'
import { STORAGE_KEY_FIRST_VISIT, STORAGE_KEY_ZEN_MODE } from '~/constants'

export const isFirstVisit = useLocalStorage(STORAGE_KEY_FIRST_VISIT, true)
export const isZenMode = useLocalStorage(STORAGE_KEY_ZEN_MODE, false)
export const toggleZenMode = useToggle(isZenMode)

export const isUserSwitcherOpen = ref(false)
export const isSigninDialogOpen = ref(false)
export const isPublishDialogOpen = ref(false)
export const isPreviewHelpOpen = ref(isFirstVisit.value)

export function openUserSwitcher() {
  isUserSwitcherOpen.value = true
}

export function openSigninDialog() {
  isSigninDialogOpen.value = true
  isUserSwitcherOpen.value = false
}

export function openPreviewHelp() {
  isPreviewHelpOpen.value = true
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
