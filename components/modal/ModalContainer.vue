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

const defaultPublishDialog = () => {
  const current = keys.current
  // exclusive 'c' - not apply in combination
  // TODO: bugfix -> create PR for vueuse, reset `current` ref on window focus|blur
  if (!current.has('shift') && !current.has('meta') && !current.has('control') && !current.has('alt')) {
    // TODO: is this the correct way of using openPublishDialog()?
    openPublishDialog('dialog', getDefaultDraft())
  }
}
whenever(logicAnd(isAuthenticated, notUsingInput, keys.c), defaultPublishDialog)

whenever(logicAnd(notUsingInput, useMagicSequence(['g', 'h'])), () => navigateTo('/home'))
whenever(logicAnd(isAuthenticated, notUsingInput, useMagicSequence(['g', 'n'])), () => navigateTo('/notifications'))

let activeStatus: HTMLElement | null = $ref(null)

const initActiveStatus = () => {
  activeStatus = document.querySelector<HTMLElement>('[aria-roledescription=status-details]')
    || document.querySelector<HTMLElement>('[aria-roledescription=status-card]')
  activeStatus?.focus()
}

// work with virtual scroller featureFlag
const virtualScroller = $(computedEager(() => useFeatureFlags().experimentalVirtualScroll))
const virtualScrollerWrap = (el: HTMLElement | null) => virtualScroller ? el?.parentElement?.parentElement : el
const virtualScrollerUnwrap = (el: HTMLElement | null) => virtualScroller ? el?.querySelector<HTMLElement>('[aria-roledescription=status-card]') : el

const validAriaRoledescriptionsToNavigatePrevNextInTimeline = ['status-details', 'status-card']
const timelineMoveUp = () => {
  if (!activeStatus || !activeStatus.isConnected) {
    initActiveStatus()
  }
  else {
    let prevEl = virtualScrollerUnwrap(virtualScrollerWrap(activeStatus)?.previousElementSibling as HTMLElement | null)
    // in detail view, 'jump over' (reply) publish widget
    while (prevEl) {
      if (prevEl && prevEl.hasAttribute('aria-roledescription') && validAriaRoledescriptionsToNavigatePrevNextInTimeline.includes(`${prevEl.getAttribute('aria-roledescription')}`)) {
        activeStatus = prevEl
        activeStatus.focus()
        break
      }
      prevEl = virtualScrollerUnwrap(virtualScrollerWrap(prevEl)?.previousElementSibling as HTMLElement | null)
    }
  }
}
const timelineMoveDown = () => {
  if (!activeStatus || !activeStatus.isConnected) {
    initActiveStatus()
  }
  else {
    let nextEl = virtualScrollerUnwrap(virtualScrollerWrap(activeStatus)?.nextElementSibling as HTMLElement | null)
    // in detail view, 'jump over' (reply) publish widget
    while (nextEl) {
      if (nextEl && nextEl.hasAttribute('aria-roledescription') && validAriaRoledescriptionsToNavigatePrevNextInTimeline.includes(`${nextEl.getAttribute('aria-roledescription')}`)) {
        activeStatus = nextEl
        activeStatus.focus()
        break
      }
      nextEl = virtualScrollerUnwrap(virtualScrollerWrap(nextEl)?.nextElementSibling as HTMLElement | null)
    }
  }
}

whenever(logicAnd(notUsingInput, keys.j), timelineMoveDown)
whenever(logicAnd(notUsingInput, keys.k), timelineMoveUp)

const toggleFavouriteActiveStatus = () => {
  let el: HTMLElement | null
  if (activeStatus && activeStatus.isConnected) {
    el = activeStatus
  }
  else {
    // status detail page 'default' (if no other reply status is onfocus/active)
    el = document.querySelector<HTMLElement>('[aria-roledescription=status-details]')
  }
  const button = el?.querySelector<HTMLElement>('button[aria-label=Favourite]')
  button?.click()
}
whenever(logicAnd(isAuthenticated, notUsingInput, keys.f), toggleFavouriteActiveStatus)

const toggleBoostActiveStatus = () => {
  let el: HTMLElement | null
  if (activeStatus && activeStatus.isConnected) {
    el = activeStatus
  }
  else {
    // status detail page 'default' (if no other reply status is onfocus/active)
    el = document.querySelector<HTMLElement>('[aria-roledescription=status-details]')
  }
  const button = el?.querySelector<HTMLElement>('button[aria-label=Boost]')
  button?.click()
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
    <!-- This `w-0` style is used to avoid overflow problems in flex layouts，so don't remove it unless you know what you're doing -->
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
  <ModalDialog v-model="isKeyboardShortcutsDialogOpen" max-w-full sm:max-w-140 md:max-w-170 lg:max-w-220 md:min-w-160>
    <MagickeysKeyboardShortcuts @close="closeKeyboardShortcuts()" />
  </ModalDialog>
</template>
