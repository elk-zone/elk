<script setup lang="ts">
const { busy, oauth, singleInstanceServer } = useSignIn()
</script>

<template>
  <div p8 lg:flex="~ col gap2" hidden>
    <p v-if="isHydrated" text-sm>
      <i18n-t keypath="user.sign_in_notice_title">
        <strong>{{ currentServer }}</strong>
      </i18n-t>
    </p>
    <p text-sm text-secondary>
      {{ $t(singleInstanceServer ? 'user.single_instance_sign_in_desc' : 'user.sign_in_desc') }}
    </p>
    <button
      v-if="singleInstanceServer"
      flex="~ row" gap-x-2 items-center justify-center btn-solid text-center rounded-3
      :disabled="busy"
      @click="oauth()"
    >
      <span v-if="busy" aria-hidden="true" block animate animate-spin preserve-3d class="rtl-flip">
        <span block i-ri:loader-2-fill aria-hidden="true" />
      </span>
      <span v-else aria-hidden="true" block i-ri:login-circle-line class="rtl-flip" />
      {{ $t('action.sign_in') }}
    </button>
    <button v-else btn-solid rounded-3 text-center mt-2 select-none @click="openSigninDialog()">
      {{ $t('action.sign_in') }}
    </button>
  </div>
</template>
