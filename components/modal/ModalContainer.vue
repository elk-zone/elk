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
  <ModalNewModalDialog v-model="isSigninDialogOpen" py-6 px-3 sm-px-6>
    <UserSignIn />
  </ModalNewModalDialog>
  <ModalNewModalDialog v-model="isPreviewHelpOpen">
    <HelpPreview @close="closePreviewHelp()" />
  </ModalNewModalDialog>
  <ModalNewModalDialog v-model="isPublishDialogOpen" max-w-180>
    <PublishWidget :draft-key="dialogDraftKey" expanded />
  </ModalNewModalDialog>
  <ModalNewModalDialog v-model="isMediaPreviewOpen" w-full max-w-full h-full max-h-full bg-transparent border-0 pointer-events-none>
    <ModalMediaPreview v-if="isMediaPreviewOpen" @close="closeMediaPreview()" />
  </ModalNewModalDialog>
  <ModalNewModalDialog v-model="isEditHistoryDialogOpen">
    <StatusEditPreview :edit="statusEdit" />
  </ModalNewModalDialog>
</template>
