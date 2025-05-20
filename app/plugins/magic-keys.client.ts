import type { RouteLocationRaw } from 'vue-router'
import { useMagicSequence } from '~/composables/magickeys'
import { currentUser, getInstanceDomain } from '~/composables/users'

export default defineNuxtPlugin(({ $scrollToTop }) => {
  const keys = useMagicKeys()
  const router = useRouter()
  const i18n = useNuxtApp().$i18n
  const { y } = useWindowScroll({ behavior: 'instant' })
  const virtualScroller = usePreferences('experimentalVirtualScroller')

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
    ;($scrollToTop as () => void)() // is this really required?
    router.push(to)
  }

  whenever(logicAnd(notUsingInput, keys['?']), toggleKeyboardShortcuts)

  const defaultPublishDialog = () => {
    const current = keys.current
    // exclusive 'c' - not apply in combination
    // TODO: bugfix -> create PR for vueuse, reset `current` ref on window focus|blur
    if (!current.has('shift') && !current.has('meta') && !current.has('control') && !current.has('alt')) {
      // TODO: is this the correct way of using openPublishDialog()?
      openPublishDialog('dialog', getDefaultDraftItem())
    }
  }
  whenever(logicAnd(isAuthenticated, notUsingInput, keys.c), defaultPublishDialog)

  const instanceDomain = currentInstance.value ? getInstanceDomain(currentInstance.value) : 'm.webtoo.ls'
  whenever(logicAnd(notUsingInput, useMagicSequence(['g', 'h'])), () => navigateTo('/home'))
  whenever(logicAnd(isAuthenticated, notUsingInput, useMagicSequence(['g', 'n'])), () => navigateTo('/notifications'))
  // TODO: always overridden by 'c' (compose) shortcut
  whenever(logicAnd(isAuthenticated, notUsingInput, useMagicSequence(['g', 'c'])), () => navigateTo('/conversations'))
  whenever(logicAnd(isAuthenticated, notUsingInput, useMagicSequence(['g', 'f'])), () => navigateTo('/favourites'))
  whenever(logicAnd(isAuthenticated, notUsingInput, useMagicSequence(['g', 'b'])), () => navigateTo('/bookmarks'))
  whenever(logicAnd(notUsingInput, useMagicSequence(['g', 'e'])), () => navigateTo(`/${instanceDomain}/explore`))
  whenever(logicAnd(notUsingInput, useMagicSequence(['g', 'l'])), () => navigateTo(`/${instanceDomain}/public/local`))
  whenever(logicAnd(notUsingInput, useMagicSequence(['g', 't'])), () => navigateTo(`/${instanceDomain}/public`))
  whenever(logicAnd(isAuthenticated, notUsingInput, useMagicSequence(['g', 'i'])), () => navigateTo('/lists'))
  whenever(logicAnd(notUsingInput, useMagicSequence(['g', 's'])), () => navigateTo('/settings'))
  whenever(logicAnd(isAuthenticated, notUsingInput, useMagicSequence(['g', 'p'])), () => navigateTo(`/${instanceDomain}/@${currentUser.value?.account.username}`))
  whenever(logicAnd(notUsingInput, computed(() => keys.current.size === 1), keys['/']), () => navigateTo('/search'))

  const toggleFavouriteActiveStatus = () => {
    // TODO: find a better solution than clicking buttons...
    document
      .querySelector<HTMLElement>('[aria-roledescription=status-details]')
      ?.querySelector<HTMLElement>(`button[aria-label=${i18n.t('action.favourite')}]`)
      ?.click()
  }
  whenever(logicAnd(isAuthenticated, notUsingInput, keys.f), toggleFavouriteActiveStatus)

  const toggleBoostActiveStatus = () => {
    // TODO: find a better solution than clicking buttons...
    document
      .querySelector<HTMLElement>('[aria-roledescription=status-details]')
      ?.querySelector<HTMLElement>(`button[aria-label=${i18n.t('action.boost')}]`)
      ?.click()
  }
  whenever(logicAnd(isAuthenticated, notUsingInput, keys.b), toggleBoostActiveStatus)

  const showNewItems = () => {
    // TODO: find a better solution than clicking buttons...
    document
      ?.querySelector<HTMLElement>('button#elk_show_new_items')
      ?.click()
  }
  whenever(logicAnd(isAuthenticated, notUsingInput, keys['.']), showNewItems)

  // TODO: virtual scroller cannot load off-screen post
  // that prevents focusing next post properly
  // we disabled this shortcut when enabled virtual scroller
  if (!virtualScroller.value) {
    const statusSelector = '[aria-roledescription="status-card"]'

    // find the nearest status element id traversing up from the current active element
    // `activeElement` can be some of an element within a status element
    // otherwise, reach to the root `<html>`
    function getActiveStatueId(element: HTMLElement): string | undefined {
      if (element.nodeName === 'HTML')
        return undefined

      if (element.matches(statusSelector))
        return element.id

      return getActiveStatueId(element.parentNode as HTMLElement)
    }

    function focusNextOrPreviousStatus(direction: 'next' | 'previous') {
      const activeStatusId = activeElement.value ? getActiveStatueId(activeElement.value) : undefined
      const nextOrPreviousStatusId = getNextOrPreviousStatusId(activeStatusId, direction)
      if (nextOrPreviousStatusId) {
        const status = document.getElementById(nextOrPreviousStatusId)
        if (status) {
          status.focus({ preventScroll: true })
          const topBarHeight = 58
          y.value += status.getBoundingClientRect().top - topBarHeight
        }
      }
    }

    function getNextOrPreviousStatusId(currentStatusId: string | undefined, direction: 'next' | 'previous'): string | undefined {
      const statusIds = [...document.querySelectorAll(statusSelector)].map(s => s.id)
      if (currentStatusId === undefined) {
        // if there is no selection, always focus on the first status
        return statusIds[0]
      }

      const currentIndex = statusIds.findIndex(id => id === currentStatusId)
      const statusId = direction === 'next'
        ? statusIds[Math.min(currentIndex + 1, statusIds.length)]
        : statusIds[Math.max(0, currentIndex - 1)]
      return statusId
    }

    whenever(logicAnd(notUsingInput, keys.j), () => focusNextOrPreviousStatus('next'))
    whenever(logicAnd(notUsingInput, keys.k), () => focusNextOrPreviousStatus('previous'))
  }
})
