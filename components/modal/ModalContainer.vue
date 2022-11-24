<script setup lang="ts">
import { isPreviewHelpOpen, isSigninDialogOpen, isUserSwitcherOpen } from '~/composables/dialog'
</script>

<template>
  <ModalDrawer v-model="isUserSwitcherOpen">
    <UserSwitcher />
  </ModalDrawer>
  <ModalDialog v-model="isSigninDialogOpen">
    <UserSignIn m6 />
  </ModalDialog>
  <ModalDialog v-model="isPreviewHelpOpen">
    <HelpPreview />
  </ModalDialog>
</template>
