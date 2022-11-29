<script setup lang="ts">
import {
  isEditHistoryDialogOpen,
  isImagePreviewDialogOpen,
  isPreviewHelpOpen,
  isPublishDialogOpen,
  isSigninDialogOpen,
} from '~/composables/dialog'
</script>

<template>
  <ModalDialog v-model="isSigninDialogOpen">
    <UserSignIn m6 />
  </ModalDialog>
  <ModalDialog v-model="isPreviewHelpOpen" :type="isSmallScreen ? 'bottom' : 'dialog'">
    <HelpPreview @close="closePreviewHelp()" />
  </ModalDialog>
  <ModalDialog v-model="isPublishDialogOpen">
    <PublishWidget :draft-key="dialogDraftKey" expanded min-w-180 />
  </ModalDialog>
  <ModalDialog v-model="isImagePreviewDialogOpen" type="preview">
    <img :src="imagePreview.src" :alt="imagePreview.alt" max-w-95vw max-h-95vh>
  </ModalDialog>
  <ModalDialog v-model="isEditHistoryDialogOpen">
    <StatusEditPreview :edit="statusEdit" />
  </ModalDialog>
</template>
