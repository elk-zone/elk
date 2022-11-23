export const isAccountSwitcherOpen = ref(false)
export const isSigninDialogOpen = ref(false)

export function openAccountSwitcher() {
  isAccountSwitcherOpen.value = true
}

export function openSigninDialog() {
  isSigninDialogOpen.value = true
  isAccountSwitcherOpen.value = false
}
