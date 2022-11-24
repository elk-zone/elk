import { STORAGE_KEY_FIRST_VISIT, STORAGE_KEY_ZEN_MODE } from '~/constants'

export const isFirstVisit = useLocalStorage(STORAGE_KEY_FIRST_VISIT, true)
export const isZenmode = useLocalStorage(STORAGE_KEY_ZEN_MODE, false)
export const toggleZenmode = useToggle(isZenmode)

export const isUserSwitcherOpen = ref(false)
export const isSigninDialogOpen = ref(false)
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

if (isPreviewHelpOpen.value) {
  watch(isPreviewHelpOpen, () => {
    isFirstVisit.value = false
  })
}
