<script setup lang="ts">
import type { mastodon } from 'masto'
import type { RouteLocationRaw } from 'vue-router'
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
  isSigninDialogOpen,
} from '~/composables/dialog'
import { useMagicSequence } from '~/composables/magickeys'
import type { ConfirmDialogChoice } from '~/types'

// TODO: move all global keyboard bindings elsewhere?!? plugin? composable?

const userSettings = useUserSettings()
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
whenever(logicAnd(notUsingInput, keys.z), () => userSettings.value.zenMode = !userSettings.value.zenMode)

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

const validAriaRoledescriptionsToNavigatePrevNextInTimeline = ['status-details', 'status-card']

// work with or without vue-virtual-scroller wrapped StatusCards
// TODO: find a solution that is less coupled, complex and better maintainable...
const virtualScrollerWrap = (el: HTMLElement | null) => el?.closest('.vue-recycle-scroller__item-view') as HTMLElement | null || el
const virtualScrollerUnwrap = (el: HTMLElement | null) => validAriaRoledescriptionsToNavigatePrevNextInTimeline.includes(el?.getAttribute('aria-roledescription') || '') ? el : el?.querySelector<HTMLElement>('[aria-roledescription=status-card]') || el

const previousElementSiblingFn = (el: HTMLElement | null) => el?.previousElementSibling as HTMLElement | null
const nextElementSiblingFn = (el: HTMLElement | null) => el?.nextElementSibling as HTMLElement | null

const timelineMoveFocus = (xElementSiblingFn: (el: HTMLElement | null) => (HTMLElement | null)) => {
  if (!activeStatus || !activeStatus.isConnected) {
    initActiveStatus()
  }
  else {
    let prevEl = virtualScrollerUnwrap(xElementSiblingFn(virtualScrollerWrap(activeStatus)))
    // in detail view, 'jump over' (reply) publish widget
    while (prevEl) {
      if (prevEl && prevEl.hasAttribute('aria-roledescription') && validAriaRoledescriptionsToNavigatePrevNextInTimeline.includes(`${prevEl.getAttribute('aria-roledescription')}`)) {
        activeStatus = prevEl
        activeStatus.focus()
        break
      }
      prevEl = virtualScrollerUnwrap(xElementSiblingFn(virtualScrollerWrap(prevEl)))
    }
  }
}

whenever(logicAnd(notUsingInput, keys.j), () => timelineMoveFocus(nextElementSiblingFn))
whenever(logicAnd(notUsingInput, keys.k), () => timelineMoveFocus(previousElementSiblingFn))

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

const handlePublished = (status: mastodon.v1.Status) => {
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

const handleFavouritedBoostedByClose = () => {
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
  </template>
</template>
