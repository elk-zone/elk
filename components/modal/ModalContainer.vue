<script setup lang="ts">
import type { mastodon } from 'masto'
import type { ConfirmDialogChoice } from '~/types'
import {
  isCommandPanelOpen,
  isConfirmDialogOpen,
  isEditHistoryDialogOpen,
  isErrorDialogOpen,
  isFavouritedBoostedByDialogOpen,
  isKeyboardShortcutsDialogOpen,
  isMediaPreviewOpen,
  isPreviewHelpOpen,
  isPublishDialogOpen,
  isReportDialogOpen,
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
  if ((e.key === 'k' || e.key === 'л') && (isMac.value ? e.metaKey : e.ctrlKey)) {
    e.preventDefault()
    openCommandPanel(e.shiftKey)
  }
  if ((e.key === '/' || e.key === ',') && (isMac.value ? e.metaKey : e.ctrlKey)) {
    e.preventDefault()
    openCommandPanel(true)
  }
})

function handlePublished(status: mastodon.v1.Status) {
  lastPublishDialogStatus.value = status
  isPublishDialogOpen.value = false
}

function handlePublishClose() {
  lastPublishDialogStatus.value = null
}

function handleConfirmChoice(choice: ConfirmDialogChoice) {
  confirmDialogChoice.value = choice
  isConfirmDialogOpen.value = false
}

function handleFavouritedBoostedByClose() {
  isFavouritedBoostedByDialogOpen.value = false
}
</script>

<template>
  <template v-if="isHydrated">
    <ModalDialog v-model="isSigninDialogOpen" py-4 px-8 max-w-125>
      <UserSignIn />
    </ModalDialog>
    <ModalDialog v-model="isPreviewHelpOpen" keep-alive max-w-125>
      <HelpPreview @close="closePreviewHelp()" />
    </ModalDialog>
    <ModalDialog
      v-model="isPublishDialogOpen"
      max-w-180 flex w-full
      @close="handlePublishClose"
    >
      <PublishWidgetList
        v-if="dialogDraftKey"
        :draft-key="dialogDraftKey"
        expanded
        class="flex-1"
        @published="handlePublished"
      />
    </ModalDialog>
    <ModalDialog
      :model-value="isMediaPreviewOpen"
      w-full max-w-full h-full max-h-full
      bg-transparent border-0 shadow-none
      @update:model-value="closeMediaPreview"
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
    <ModalDialog v-model="isErrorDialogOpen" py-4 px-8 max-w-125>
      <ModalError v-if="errorDialogData" v-bind="errorDialogData" />
    </ModalDialog>
    <ModalDialog
      v-model="isFavouritedBoostedByDialogOpen"
      max-w-180
      @close="handleFavouritedBoostedByClose"
    >
      <StatusFavouritedBoostedBy />
    </ModalDialog>
    <ModalDialog v-model="isKeyboardShortcutsDialogOpen" max-w-full sm:max-w-140 md:max-w-170 lg:max-w-220 md:min-w-160>
      <MagickeysKeyboardShortcuts @close="closeKeyboardShortcuts()" />
    </ModalDialog>
    <ModalDialog v-model="isReportDialogOpen" keep-alive max-w-175>
      <ReportModal v-if="reportAccount" :account="reportAccount" :status="reportStatus" @close="closeReportDialog()" />
    </ModalDialog>
  </template>
</template>
