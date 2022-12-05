<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import {
  isEditHistoryDialogOpen,
  isKeyboardShortcutsDialogOpen,
  isMediaPreviewOpen,
  isPreviewHelpOpen,
  isPublishDialogOpen,
  isSigninDialogOpen,
} from '~/composables/dialog'
import { useMagicSequence } from '~/composables/magickeys'

// TODO: move all global keyboard bindings elsewhere?!? plugin? composable?

const keys = useMagicKeys()
const router = useRouter()
const { $scrollToTop } = useNuxtApp()

// disable shortcuts when focused on inputs (https://vueuse.org/core/usemagickeys/#conditionally-disable)
const activeElement = useActiveElement()

const notUsingInput = computed(() =>
  activeElement.value?.tagName !== 'INPUT'
  && activeElement.value?.tagName !== 'TEXTAREA'
  && !activeElement.value?.isContentEditable,
)
const isAuthenticated = currentUser.value !== undefined

const navigateTo = (to: string | RouteLocationRaw) => {
  closeKeyboardShortcuts()
  $scrollToTop() // is this really required?
  router.push(to)
}

whenever(logicAnd(notUsingInput, keys['?']), toggleKeyboardShortcuts)

// TODO: is this the correct way of using openPublishDialog()?
const defaultPublishDialog = () => openPublishDialog('dialog', getDefaultDraft())
whenever(logicAnd(isAuthenticated, notUsingInput, keys.c), defaultPublishDialog)

whenever(logicAnd(notUsingInput, useMagicSequence(['g', 'h'])), () => navigateTo('/home'))
whenever(logicAnd(isAuthenticated, notUsingInput, useMagicSequence(['g', 'n'])), () => navigateTo('/notifications'))

let activeStatus: HTMLElement | null = $ref(null)

const initActiveStatus = () => {
  activeStatus = document.querySelector<HTMLElement>('[aria-roledescription=status-details]')
    || document.querySelector<HTMLElement>('[aria-roledescription=status-card]')
  activeStatus?.focus()
}

const timelineMoveUp = () => {
  if (!activeStatus || !activeStatus.isConnected) {
    initActiveStatus()
  }
  else {
    const prevEl = activeStatus?.previousElementSibling as HTMLElement | null
    // if (prevEl) {
    if (prevEl && prevEl.hasAttribute('aria-roledescription') && ['status-details', 'status-card'].includes(`${prevEl.getAttribute('aria-roledescription')}`)) {
      activeStatus = prevEl
      activeStatus.focus()
    }
  }
}
const timelineMoveDown = () => {
  if (!activeStatus || !activeStatus.isConnected) {
    initActiveStatus()
  }
  else {
    const nextEl = activeStatus?.nextElementSibling as HTMLElement | null
    if (nextEl && nextEl.hasAttribute('aria-roledescription') && ['status-details', 'status-card'].includes(`${nextEl.getAttribute('aria-roledescription')}`)) {
      activeStatus = nextEl
      activeStatus.focus()
    }
  }
}

whenever(logicAnd(notUsingInput, keys.j), timelineMoveDown)
whenever(logicAnd(notUsingInput, keys.k), timelineMoveUp)

const toggleFavouriteActiveStatus = () => {
  (activeStatus || document.querySelector<HTMLElement>('[aria-roledescription=status-details]'))
    ?.querySelector<HTMLElement>('button[aria-label=Favourite]')?.click()
}
whenever(logicAnd(isAuthenticated, notUsingInput, keys.f), toggleFavouriteActiveStatus)

const toggleBoostActiveStatus = () => {
  (activeStatus || document.querySelector<HTMLElement>('[aria-roledescription=status-details]'))
    ?.querySelector<HTMLElement>('button[aria-label=Boost]')?.click()
}
whenever(logicAnd(isAuthenticated, notUsingInput, keys.b), toggleBoostActiveStatus)
</script>

<template>
  <ModalDialog v-model="isSigninDialogOpen" py-4 px-8>
    <UserSignIn />
  </ModalDialog>
  <ModalDialog v-model="isPreviewHelpOpen">
    <HelpPreview @close="closePreviewHelp()" />
  </ModalDialog>
  <ModalDialog v-model="isPublishDialogOpen" max-w-180 flex>
    <PublishWidget :draft-key="dialogDraftKey" expanded flex-1 />
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
  <ModalDialog v-model="isKeyboardShortcutsDialogOpen" max-w-full sm:max-w-140 md:max-w-170 lg:max-w-220 md:min-w-160>
    <MagickeysKeyboardShortcuts @close="closeKeyboardShortcuts()" />
  </ModalDialog>
</template>
