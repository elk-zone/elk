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

  const toggleFavouriteActiveStatus = () => {
    // TODO: find a better solution than clicking buttons...
    document
      .querySelector<HTMLElement>('[aria-roledescription=status-details]')
      ?.querySelector<HTMLElement>('button[aria-label=Favourite]')
      ?.click()
  }
  whenever(logicAnd(isAuthenticated, notUsingInput, keys.f), toggleFavouriteActiveStatus)

  const toggleBoostActiveStatus = () => {
    // TODO: find a better solution than clicking buttons...
    document
      .querySelector<HTMLElement>('[aria-roledescription=status-details]')
      ?.querySelector<HTMLElement>('button[aria-label=Boost]')
      ?.click()
  }
  whenever(logicAnd(isAuthenticated, notUsingInput, keys.b), toggleBoostActiveStatus)
})
