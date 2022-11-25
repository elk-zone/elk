<script setup lang="ts">
import { isPreviewHelpOpen, isPublishDialogOpen, isSigninDialogOpen, isUserSwitcherOpen } from '~/composables/dialog'
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
  <ModalDialog v-model="isPublishDialogOpen">
    <PublishWidget draft-key="dialog" expanded min-w-180 />
  </ModalDialog>
</template>
