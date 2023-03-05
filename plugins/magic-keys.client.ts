import type { RouteLocationRaw } from 'vue-router'
import { useMagicSequence } from '~/composables/magickeys'

export default defineNuxtPlugin(({ $scrollToTop }) => {
  const userSettings = useUserSettings()
  const keys = useMagicKeys()
  const router = useRouter()

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
})
