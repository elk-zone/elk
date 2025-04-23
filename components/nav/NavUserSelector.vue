<script setup lang="ts">
const { busy, oauth, singleInstanceServer } = useSignIn()

function navigateToSignIn() {
  return navigateTo(`/${currentServer.value}`)
}
</script>

<template>
  <VDropdown v-if="isHydrated && currentUser">
    <div style="-webkit-touch-callout: none;" sm:hidden>
      <div i-ri:arrow-down-s-line text-sm text-secondary me--1 />
    </div>

    <template #popper="{ hide }">
      <UserSwitcher @click="hide()" />
    </template>
  </VDropdown>
  <template v-else>
    <button
      v-if="singleInstanceServer" flex="~ row" gap-x-1 items-center justify-center btn-solid text-sm px-2 py-1
      xl:hidden :disabled="busy" @click="oauth()"
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
      v-else flex="~ row" gap-x-1 items-center justify-center btn-solid text-sm px-2 py-1 xl:hidden
      @click="navigateToSignIn()"
    >
      <span aria-hidden="true" block i-ri:login-circle-line class="rtl-flip" />
      {{ $t('action.sign_in') }}
    </button>
  </template>
</template>
