<script setup lang="ts">
// import { logicOr, logicAnd } from '@vueuse/math'
import {
  isEditHistoryDialogOpen,
  isKeyboardShortcutsDialogOpen,
  isMediaPreviewOpen,
  isPreviewHelpOpen,
  isPublishDialogOpen,
  isSigninDialogOpen,
} from '~/composables/dialog'

const keys = useMagicKeys()

// TODO: does shift+slash apply for all keyboard layouts? It does for (all?) (Apple) English but may not for others..?
//       ref: https://mwichary.medium.com/international-apple-keyboards-layouts-93437d7f9273
// TODO: move all global keyboard bindings elsewhere?!? plugin? composable?
whenever(keys.Shift_Slash, toggleKeyboardShortcuts)

// TODO: is this the correct way of using openPublishDialog()?
const defaultPublishDialog = () => openPublishDialog('dialog', getDefaultDraft())

// TODO: add '@vueuse/math' & use logicAnd/Or?
// whenever(logicOr(keys.c, keys.n), openPublishDialog)
// TODO: only enable shortcut if authenticated
// whenever(logicAnd(__isAuthenticated__, logicOr(keys.c, keys.n)), openPublishDialog)

// TODO: disable shortcuts when focused on inputs -> https://vueuse.org/core/usemagickeys/#conditionally-disable
// const activeElement = useActiveElement()
// const notUsingInput = computed(() =>
//   activeElement.value?.tagName !== 'INPUT'
//   && activeElement.value?.tagName !== 'TEXTAREA',
// )

whenever(keys.c, defaultPublishDialog)
whenever(keys.n, defaultPublishDialog)
</script>

<template>
  <ModalDialog v-model="isSigninDialogOpen" py-4 px-8>
    <UserSignIn />
  </ModalDialog>
  <ModalDialog v-model="isPreviewHelpOpen">
    <HelpPreview @close="closePreviewHelp()" />
  </ModalDialog>
  <ModalDialog v-model="isPublishDialogOpen" max-w-180 md:min-w-160>
    <PublishWidget :draft-key="dialogDraftKey" expanded />
  </ModalDialog>
  <ModalDialog v-model="isMediaPreviewOpen" w-full max-w-full h-full max-h-full bg-transparent border-0 pointer-events-none>
    <ModalMediaPreview v-if="isMediaPreviewOpen" @close="closeMediaPreview()" />
  </ModalDialog>
  <ModalDialog v-model="isEditHistoryDialogOpen">
    <StatusEditPreview :edit="statusEdit" />
  </ModalDialog>
  <ModalDialog v-model="isKeyboardShortcutsDialogOpen">
    <MagickeysKeyboardShortcuts @close="closeKeyboardShortcuts()" />
  </ModalDialog>
</template>
