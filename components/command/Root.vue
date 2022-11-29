<script setup lang="ts">
import type { ComputedRef } from 'vue'
import type { LocaleObject } from '@nuxtjs/i18n/dist/runtime/composables'

const { locale } = useI18n()
const { locales } = useI18n() as { locales: ComputedRef<LocaleObject[]> }
const users = useUsers()

useCommand({
  scope: 'Actions',

  visible: () => !!currentUser.value,

  id: 'compose',
  name: 'Compose',
  icon: 'i-ri:quill-pen-line',
  description: 'Write a new post',

  onActivate() {
    openPublishDialog()
  },
})

useCommand({
  scope: 'Preferences',

  id: 'toggle-dark',
  name: 'Toggle dark mode',
  icon: () => isDark.value ? 'i-ri:sun-line' : 'i-ri:moon-line',

  onActivate() {
    toggleDark()
  },
})

useCommand({
  scope: 'Preferences',

  id: 'toggle-zen',
  name: 'Toggle zen mode',
  icon: () => isZenMode.value ? 'i-ri:layout-right-2-line' : 'i-ri:layout-right-line',

  onActivate() {
    toggleZenMode()
  },
})

useCommand({
  scope: 'Preferences',

  id: 'language',
  name: 'Select language',
  icon: 'i-ri:earth-line',

  onComplete: () => 'language',
})
useCommands(() => locales.value.map(l => ({
  parent: 'language',
  scope: 'Languages',

  id: `language.${l.code}`,
  name: l.name!,
  icon: 'i-ri:earth-line',

  onActivate() {
    locale.value = l.code
  },
})))

useCommand({
  scope: 'Account',

  id: 'account-add',
  name: 'Sign in',
  description: 'Add an existing account',
  icon: 'i-ri:user-add-line',

  onActivate() {
    openSigninDialog()
  },
})
useCommand({
  scope: 'Account',

  visible: () => users.value.length > 1,

  id: 'account-switch',
  name: 'Switch account',
  description: 'Switch to another account',
  icon: 'i-ri:user-shared-line',

  onComplete: () => 'account-switch',
})
useCommands(() => users.value.map(user => ({
  parent: 'account-switch',
  scope: 'Switch account',

  visible: () => user.account.id !== currentUser.value?.account.id,

  id: `account-switch.${user.account.id}`,
  name: `Switch to ${getFullHandle(user.account)}`,
  icon: 'i-ri:user-shared-line',

  onActivate() {
    loginTo(user)
  },
})))
useCommand({
  scope: 'Account',

  visible: () => !!currentUser.value,

  id: 'account-logout',
  name: () => `Sign out ${getFullHandle(currentUser.value!.account)}`,
  icon: 'i-ri:logout-box-line',

  onActivate() {
    signout()
  },
})
</script>

<template>
  <CommandPanel />
</template>
