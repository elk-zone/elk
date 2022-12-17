<template>
  <div p8 flex="~ col gap4">
    <p v-if="isMastoInitialised" text-sm>
      Viewing <strong>{{ currentServer }}</strong> public data
    </p>
    <p text-sm text-secondary>
      {{ $t('nav_user.sign_in_desc') }}
    </p>
    <button class="btn-solid text-center" @click="openSigninDialog()">
      {{ $t('action.sign_in') }}
    </button>
  </div>
</template>
