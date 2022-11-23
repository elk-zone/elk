<script setup lang="ts">
import { isSigninDialogOpen, isUserSwitcherOpen } from '~/composables/dialog'
</script>

<template>
  <ModalDrawer v-model="isUserSwitcherOpen">
    <UserSwitcher />
  </ModalDrawer>
  <ModalDialog v-model="isSigninDialogOpen">
    <UserSignIn m6 />
  </ModalDialog>
</template>
