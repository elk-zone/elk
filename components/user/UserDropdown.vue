<script setup lang="ts">
// workaround: cannot use TSNonNull `!` in template
const account = $computed(() => currentUser.value!.account!)
</script>

<template>
  <VDropdown :distance="0" placement="top-start">
    <button btn-action-icon :aria-label="$t('action.switch_account')">
      <div :class="{ 'hidden xl:block': currentUser }" i-ri:more-2-line />
      <AccountAvatar v-if="!isGuest" xl:hidden :account="account" w-9 h-9 />
      <span v-else>TODO: Guest</span>
    </button>
    <template #popper="{ hide }">
      <UserSwitcher @click="hide" />
    </template>
  </VDropdown>
</template>
