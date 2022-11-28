<script setup lang="ts">
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
</script>

<template>
  <CommandPanel />
</template>
