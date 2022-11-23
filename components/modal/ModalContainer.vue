<script setup lang="ts">
import { isAccountSwitcherOpen, isSigninDialogOpen } from '~/composables/dialog'
</script>

<template>
  <ModalDrawer v-model="isAccountSwitcherOpen">
    <AccountSwitcher />
  </ModalDrawer>
  <ModalDialog v-model="isSigninDialogOpen">
    <AccountSignIn m6 />
  </ModalDialog>
</template>
