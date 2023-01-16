<template>
  <VDropdown v-if="isHydrated && currentUser" sm:hidden>
    <div style="-webkit-touch-callout: none;">
      <AccountAvatar
        ref="avatar"
        :account="currentUser.account"
        h-8
        w-8
        :draggable="false"
        square
      />
    </div>

    <template #popper="{ hide }">
      <UserSwitcher ref="switcher" @click="hide()" />
    </template>
  </VDropdown>
  <button v-else btn-solid text-sm px-2 py-1 text-center xl:hidden @click="openSigninDialog()">
    {{ $t('action.sign_in') }}
  </button>
</template>
