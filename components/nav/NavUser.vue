<template>
  <VDropdown v-if="currentUser">
    <div style="-webkit-touch-callout: none;">
      <AccountAvatar
        ref="avatar"
        :account="currentUser.account"
        h="2em"
        :draggable="false"
      />
    </div>

    <template #popper="{ hide }">
      <UserSwitcher ref="switcher" @click="hide()" />
    </template>
  </VDropdown>
  <button v-else btn-solid text-sm px-2 py-1 text-center @click="openSigninDialog()">
    {{ $t('action.sign_in') }}
  </button>
</template>
