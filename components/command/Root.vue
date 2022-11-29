<script setup lang="ts">
import type { ComputedRef } from 'vue'
import type { LocaleObject } from '@nuxtjs/i18n/dist/runtime/composables'

const { locale } = useI18n()
const { locales } = useI18n() as { locales: ComputedRef<LocaleObject[]> }
const users = useUsers()

useCommand({
  scope: 'Actions',

  visible: () => currentUser.value,

  name: 'Compose',
  icon: 'i-ri:quill-pen-line',
  description: 'Write a new post',

  onActivate() {
    openPublishDialog()
  },
})

useCommand({
  scope: 'Preferences',

  name: 'Toggle dark mode',
  icon: () => isDark.value ? 'i-ri:sun-line' : 'i-ri:moon-line',

  onActivate() {
    toggleDark()
  },
})

useCommand({
  scope: 'Preferences',

  name: 'Toggle Zen mode',
  icon: () => isZenMode.value ? 'i-ri:layout-right-2-line' : 'i-ri:layout-right-line',

  onActivate() {
    toggleZenMode()
  },
})

useCommand({
  scope: 'Preferences',

  name: 'Select language',
  icon: 'i-ri:earth-line',

  onComplete: () => ({
    id: 'language',
    display: 'Languages',
  }),
})
useCommands(() => locales.value.map(l => ({
  parent: 'language',
  scope: 'Languages',

  name: l.name!,
  icon: 'i-ri:earth-line',

  onActivate() {
    locale.value = l.code
  },
})))

useCommand({
  scope: 'Account',

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

  name: 'Switch account',
  description: 'Switch to another account',
  icon: 'i-ri:user-shared-line',

  onComplete: () => ({
    id: 'account-switch',
    display: 'Accounts',
  }),
})
useCommands(() => users.value.map(user => ({
  parent: 'account-switch',
  scope: 'Switch account',

  visible: () => user.account.id !== currentUser.value?.account.id,

  name: `Switch to ${getFullHandle(user.account)}`,
  icon: 'i-ri:user-shared-line',

  onActivate() {
    loginTo(user)
  },
})))
useCommand({
  scope: 'Account',

  visible: () => currentUser.value,

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
