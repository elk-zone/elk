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
  <ModalDialog v-model="isSigninDialogOpen" py-6 px-3 sm-px-6>
    <UserSignIn />
  </ModalDialog>
  <ModalDialog v-model="isPreviewHelpOpen">
    <HelpPreview @close="closePreviewHelp()" />
  </ModalDialog>
  <ModalDialog v-model="isPublishDialogOpen" max-w-180>
    <PublishWidget :draft-key="dialogDraftKey" expanded />
  </ModalDialog>
  <ModalDialog v-model="isMediaPreviewOpen" w-full max-w-full h-full max-h-full bg-transparent border-0 pointer-events-none>
    <ModalMediaPreview v-if="isMediaPreviewOpen" @close="closeMediaPreview()" />
  </ModalDialog>
  <ModalDialog v-model="isEditHistoryDialogOpen">
    <StatusEditPreview :edit="statusEdit" />
  </ModalDialog>
</template>
