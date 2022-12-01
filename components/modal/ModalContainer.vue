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
  <ModalNewModalDialog v-model="isSigninDialogOpen">
    <UserSignIn m6 />
  </ModalNewModalDialog>
  <ModalNewModalDialog v-model="isPreviewHelpOpen">
    <HelpPreview @close="closePreviewHelp()" />
  </ModalNewModalDialog>
  <ModalNewModalDialog v-model="isPublishDialogOpen" max-w-180>
    <PublishWidget :draft-key="dialogDraftKey" expanded />
  </ModalNewModalDialog>
  <ModalDialog v-model="isMediaPreviewOpen" close-button>
    <ModalMediaPreview v-if="isMediaPreviewOpen" @close="closeMediaPreview()" />
  </ModalDialog>
  <ModalNewModalDialog v-model="isEditHistoryDialogOpen">
    <StatusEditPreview :edit="statusEdit" />
  </ModalNewModalDialog>
</template>
