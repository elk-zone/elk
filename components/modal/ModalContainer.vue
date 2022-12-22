<script setup lang="ts">
import {
  isCommandPanelOpen,
  isEditHistoryDialogOpen,
  isMediaPreviewOpen,
  isPreviewHelpOpen,
  isPublishDialogOpen,
  isSigninDialogOpen,
} from '~/composables/dialog'

const isMac = useIsMac()

// TODO: temporary, await for keybind system
// open search panel
// listen to ctrl+k on windows/linux or cmd+k on mac
// open command panel
// listen to ctrl+/ on windows/linux or cmd+/ on mac
// or shift+ctrl+k on windows/linux or shift+cmd+k on mac
useEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key === 'k' && (isMac.value ? e.metaKey : e.ctrlKey)) {
    e.preventDefault()
    openCommandPanel(e.shiftKey)
  }
  if (e.key === '/' && (isMac.value ? e.metaKey : e.ctrlKey)) {
    e.preventDefault()
    openCommandPanel(true)
  }
})
</script>

<template>
  <ModalDialog v-model="isPreviewHelpOpen" max-w-125>
    <LazyHelpPreview @close="closePreviewHelp()" />
  </ModalDialog>
  <ClientOnly v-if="isMastoInitialised">
    <ModalDialog v-model="isSigninDialogOpen" py-4 px-8 max-w-125>
      <LazyUserSignIn />
    </ModalDialog>
    <ModalDialog v-model="isPublishDialogOpen" max-w-180 flex>
      <!-- This `w-0` style is used to avoid overflow problems in flex layouts，so don't remove it unless you know what you're doing -->
      <LazyPublishWidget v-if="currentUser" :draft-key="dialogDraftKey" expanded flex-1 w-0 />
    </ModalDialog>
    <ModalDialog
      v-model="isMediaPreviewOpen"
      w-full max-w-full h-full max-h-full
      bg-transparent border-0 shadow-none
    >
      <LazyModalMediaPreview v-if="isMediaPreviewOpen" @close="closeMediaPreview()" />
    </ModalDialog>
    <ModalDialog v-model="isEditHistoryDialogOpen" max-w-125>
      <LazyStatusEditPreview :edit="statusEdit" />
    </ModalDialog>
    <ModalDialog v-model="isCommandPanelOpen" max-w-fit flex>
      <LazyCommandPanel @close="closeCommandPanel()" />
    </ModalDialog>
  </ClientOnly>
</template>
