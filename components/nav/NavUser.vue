<script setup lang="ts">
const router = useRouter()
const { oauth } = useSignIn()

function clickUser() {
  if (currentUser.value)
    router.push(getAccountRoute(currentUser.value.account))
}

function signIn() {
  oauth()
}
</script>

<template>
  <AccountAvatar
    v-if="isHydrated && currentUser" sm:hidden :account="currentUser.account" h-8 w-8 :draggable="false"
    square @click="clickUser"
  />
  <button
    v-else flex="~ row" gap-x-1 items-center justify-center btn-solid text-sm px-2 py-1 xl:hidden
    @click="signIn()"
  >
    <span aria-hidden="true" block i-ri:login-circle-line class="rtl-flip" />
    {{ $t('action.sign_in') }}
  </button>
</template>
