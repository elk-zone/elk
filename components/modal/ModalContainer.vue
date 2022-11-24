<script setup lang="ts">
import { isPreviewHelpOpen, isPublishDialogOpen, isSigninDialogOpen, isUserSwitcherOpen } from '~/composables/dialog'
</script>

<template>
  <ModalDrawer v-if="isUserSwitcherOpen" v-model="isUserSwitcherOpen">
    <UserSwitcher />
  </ModalDrawer>
  <ModalDialog v-else-if="isSigninDialogOpen">
    <UserSignIn m6 />
  </ModalDialog>
  <ModalDialog v-else-if="isPreviewHelpOpen">
    <HelpPreview />
  </ModalDialog>
  <ModalDialog v-else-if="isPublishDialogOpen">
    <PublishWidget draft-key="dialog" expanded min-w-180 p6 />
  </ModalDialog>
</template>
