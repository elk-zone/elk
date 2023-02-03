<script setup lang="ts">
const { busy, signIn, singleInstanceServer } = useSingleSignIn()
</script>

<template>
  <div p8 lg:flex="~ col gap2" hidden>
    <p v-if="isHydrated" text-sm>
      <i18n-t keypath="user.sign_in_notice_title">
        <strong>{{ currentServer }}</strong>
      </i18n-t>
    </p>
    <p text-sm text-secondary>
      {{ $t('user.sign_in_desc') }}
    </p>
    <button
      v-if="singleInstanceServer"
      btn-solid rounded-3 text-center mt-2 select-none
      :disabled="busy"
      @click="signIn()"
    >
      {{ $t('action.sign_in') }}
    </button>
    <button v-else btn-solid rounded-3 text-center mt-2 select-none @click="openSigninDialog()">
      {{ $t('action.sign_in') }}
    </button>
  </div>
</template>
