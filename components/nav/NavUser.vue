<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'

const avatar = ref<ComponentPublicInstance>()
const switcher = ref()

let showSwitcher = $ref(false)

onClickOutside(avatar, () => {
  showSwitcher = false
}, { ignore: [switcher] })
</script>

<template>
  <VDropdown
    v-if="currentUser"
    v-model:shown="showSwitcher"
    :triggers="[]"
    :auto-hide="false"
    @click="showSwitcher = true"
  >
    <div style="-webkit-touch-callout: none;">
      <AccountAvatar
        ref="avatar"
        :account="currentUser.account"
        h="2em"
        :draggable="false"
      />
    </div>

    <template #popper>
      <UserSwitcher ref="switcher" />
    </template>
  </VDropdown>
  <button v-else btn-solid text-sm px-2 py-1 text-center @click="openSigninDialog()">
    Sign in
  </button>
</template>
