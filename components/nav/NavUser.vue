<template>
  <VDropdown v-if="isMastoInitialised && currentUser" sm:hidden>
    <div style="-webkit-touch-callout: none;">
      <AccountAvatar
        v-if="!currentUser.guest"
        ref="avatar"
        :account="currentUser.account"
        h-8
        w-8
        :draggable="false"
        square
      />
      <div v-else bg="gray/40" rounded-full w-8 h-8 flex items-center justify-center text-5>
        G
      </div>
    </div>

    <template #popper="{ hide }">
      <UserSwitcher ref="switcher" @click="hide()" />
    </template>
  </VDropdown>
  <button v-else btn-solid text-sm px-2 py-1 text-center xl:hidden @click="openSigninDialog()">
    {{ $t('action.sign_in') }}
  </button>
</template>
