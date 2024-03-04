import type { RouteLocationRaw } from 'vue-router'
import { useMagicSequence } from '~/composables/magickeys'
import { currentUser, getInstanceDomain } from '~/composables/users'

export default defineNuxtPlugin(({ $scrollToTop }) => {
  const keys = useMagicKeys()
  const router = useRouter()
  const i18n = useNuxtApp().$i18n

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
      openPublishDialog('dialog', getDefaultDraft())
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
  whenever(logicAnd(notUsingInput, keys['/']), () => navigateTo('/search'))

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
})
