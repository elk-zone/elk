<script setup lang="ts">
import type { Status } from 'masto'
import type { ConfirmDialogChoice } from '~/types'
import {
  isCommandPanelOpen,
  isConfirmDialogOpen,
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

const handlePublished = (status: Status) => {
  lastPublishDialogStatus.value = status
  isPublishDialogOpen.value = false
}

const handlePublishClose = () => {
  lastPublishDialogStatus.value = null
}

const handleConfirmChoice = (choice: ConfirmDialogChoice) => {
  confirmDialogChoice.value = choice
  isConfirmDialogOpen.value = false
}
</script>

<template>
  <template v-if="isMastoInitialised">
    <ModalDialog v-model="isSigninDialogOpen" py-4 px-8 max-w-125>
      <UserSignIn />
    </ModalDialog>
    <ModalDialog v-model="isPreviewHelpOpen" keep-alive max-w-125>
      <HelpPreview @close="closePreviewHelp()" />
    </ModalDialog>
    <ModalDialog
      v-model="isPublishDialogOpen"
      max-w-180 flex
      @close="handlePublishClose"
    >
      <!-- This `w-0` style is used to avoid overflow problems in flex layouts，so don't remove it unless you know what you're doing -->
      <PublishWidget
        v-if="dialogDraftKey"
        :draft-key="dialogDraftKey" expanded flex-1 w-0
        @published="handlePublished"
      />
    </ModalDialog>
    <ModalDialog
      v-model="isMediaPreviewOpen"
      w-full max-w-full h-full max-h-full
      bg-transparent border-0 shadow-none
    >
      <ModalMediaPreview v-if="isMediaPreviewOpen" @close="closeMediaPreview()" />
    </ModalDialog>
    <ModalDialog v-model="isEditHistoryDialogOpen" max-w-125>
      <StatusEditPreview v-if="statusEdit" :edit="statusEdit" />
    </ModalDialog>
    <ModalDialog v-model="isCommandPanelOpen" max-w-fit flex>
      <CommandPanel @close="closeCommandPanel()" />
    </ModalDialog>
    <ModalDialog v-model="isConfirmDialogOpen" py-4 px-8 max-w-125>
      <ModalConfirm v-if="confirmDialogLabel" v-bind="confirmDialogLabel" @choice="handleConfirmChoice" />
    </ModalDialog>
  </template>
</template>
