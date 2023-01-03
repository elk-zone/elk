<template>
  <div p8 lg:flex="~ col gap2" hidden>
    <p v-if="isMastoInitialised" text-sm>
      <i18n-t keypath="user.sign_in_notice_title">
        <strong>{{ currentServer }}</strong>
      </i18n-t>
    </p>
    <p text-sm text-secondary>
      {{ $t('user.sign_in_desc') }}
    </p>
    <button btn-solid text-center mt-2 @click="openSigninDialog()">
      {{ $t('action.sign_in') }}
    </button>
  </div>
</template>
