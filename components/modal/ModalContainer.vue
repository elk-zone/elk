<script setup lang="ts">
import {
  isEditHistoryDialogOpen,
  isMediaPreviewOpen,
  isPreviewHelpOpen,
  isPublishDialogOpen,
  isSigninDialogOpen,
} from '~/composables/dialog'
</script>

<template>
  <ModalDialog v-model="isSigninDialogOpen" py-4 px-8>
    <UserSignIn />
  </ModalDialog>
  <ModalDialog v-model="isPreviewHelpOpen">
    <HelpPreview @close="closePreviewHelp()" />
  </ModalDialog>
  <ModalDialog v-model="isPublishDialogOpen" max-w-180 flex>
    <PublishWidget :draft-key="dialogDraftKey" expanded flex-1 w-0 />
  </ModalDialog>
  <ModalDialog
    v-model="isMediaPreviewOpen"
    pointer-events-none
    w-full max-w-full h-full max-h-full
    bg-transparent border-0 shadow-none
  >
    <ModalMediaPreview v-if="isMediaPreviewOpen" @close="closeMediaPreview()" />
  </ModalDialog>
  <ModalDialog v-model="isEditHistoryDialogOpen">
    <StatusEditPreview :edit="statusEdit" />
  </ModalDialog>
</template>
