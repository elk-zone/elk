<script setup lang="ts">
const { busy, oauth, singleInstanceServer } = useSignIn()
</script>

<template>
  <button
    v-if="singleInstanceServer"
    flex="~ row" gap-x-2 items-center justify-center btn-solid text-center rounded-3 w-full whitespace-nowrap
    :disabled="busy"
    @click="oauth()"
  >
    <span v-if="busy" aria-hidden="true" block animate animate-spin preserve-3d class="rtl-flip">
      <span block i-ri:loader-2-fill aria-hidden="true" />
    </span>
    <span v-else aria-hidden="true" block i-ri:login-circle-line class="rtl-flip" />
    {{ $t('action.sign_in') }}
  </button>
  <button v-else btn-solid rounded-3 text-center select-none w-full whitespace-nowrap @click="openSigninDialog()">
    {{ $t('action.sign_in') }}
  </button>
</template>
