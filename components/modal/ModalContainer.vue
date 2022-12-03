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
  <ModalDialog v-model="isPublishDialogOpen" max-w-180 md:min-w-160>
    <!-- You can avoid the default scrolling behavior of popups by using header or footer slots, -->
    <!-- but you can also disable the scrolling style of the default slots by using custom-class="!overflow-visible" -->
    <template #header>
      <PublishWidget :draft-key="dialogDraftKey" expanded />
    </template>
  </ModalDialog>
  <ModalDialog v-model="isMediaPreviewOpen" w-full max-w-full h-full max-h-full bg-transparent border-0 pointer-events-none>
    <template #header>
      <ModalMediaPreview v-if="isMediaPreviewOpen" @close="closeMediaPreview()" />
    </template>
  </ModalDialog>
  <ModalDialog v-model="isEditHistoryDialogOpen">
    <template #header>
      <StatusEditPreview :edit="statusEdit" />
    </template>
  </ModalDialog>
</template>
