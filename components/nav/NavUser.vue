<script setup lang="ts">
const { busy, oauth, singleInstanceServer } = useSignIn()
</script>

<template>
  <VDropdown v-if="isHydrated && currentUser" sm:hidden>
    <div style="-webkit-touch-callout: none;">
      <AccountAvatar
        :account="currentUser.account"
        h-8
        w-8
        :draggable="false"
        square
      />
    </div>

    <template #popper="{ hide }">
      <UserSwitcher @click="hide()" />
    </template>
  </VDropdown>
  <template v-else>
    <button
      v-if="singleInstanceServer"
      flex="~ row"
      gap-x-1 items-center justify-center btn-solid text-sm px-2 py-1 xl:hidden
      :disabled="busy"
      @click="oauth()"
    >
      <span v-if="busy" aria-hidden="true" block animate animate-spin preserve-3d class="rtl-flip">
        <span block i-ri:loader-2-fill aria-hidden="true" />
      </span>
      <span v-else aria-hidden="true" block i-ri:login-circle-line class="rtl-flip" />
      <i18n-t keypath="action.sign_in_to">
        <strong>{{ currentServer }}</strong>
      </i18n-t>
    </button>
    <button
      v-else
      flex="~ row"
      gap-x-1 items-center justify-center btn-solid text-sm px-2 py-1 xl:hidden
      @click="openSigninDialog()"
    >
      <span aria-hidden="true" block i-ri:login-circle-line class="rtl-flip" />
      {{ $t('action.sign_in') }}
    </button>
  </template>
</template>
