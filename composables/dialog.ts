export const isUserSwitcherOpen = ref(false)
export const isSigninDialogOpen = ref(false)

export function openUserSwitcher() {
  isUserSwitcherOpen.value = true
}

export function openSigninDialog() {
  isSigninDialogOpen.value = true
  isUserSwitcherOpen.value = false
}
