<script setup lang="ts">
import { isImagePreviewDialogOpen, isPreviewHelpOpen, isPublishDialogOpen, isSigninDialogOpen, isUserSwitcherOpen } from '~/composables/dialog'
</script>

<template>
  <ModalDrawer v-model="isUserSwitcherOpen" direction="right">
    <UserSwitcher min-w-100 />
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
  <ModalDialog v-model="isImagePreviewDialogOpen">
    <img :src="imagePreview.src" :alt="imagePreview.alt" max-w-95vw max-h-95vh>
  </ModalDialog>
</template>
