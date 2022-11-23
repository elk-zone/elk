<script setup lang="ts">
const allAccounts = useAccounts()

const sortedAccounts = computed(() => {
  return [
    currentUser.value!,
    ...allAccounts.value.filter(account => account.token !== currentUser.value?.token),
  ].filter(Boolean)
})
</script>

<template>
  <div max-w-40rem mxa p4 flex="~ col gap2">
    <h1 text-2xl>
      Switch Account
    </h1>
    <div mx--2>
      <template v-for="acc of sortedAccounts" :key="acc.id">
        <AccountInfo
          :account="acc.account"
          :link="false"
          :full-server="true"
          rounded p2
          hover:bg-active cursor-pointer
          @click="loginTo(acc)"
        >
          <template v-if="acc.token === currentUser?.token">
            <div flex-auto />
            <div i-ri:check-line text-primary mya text-2xl />
          </template>
        </AccountInfo>
      </template>
    </div>
    <div mx--4 border="t base" pt2>
      <button btn-text flex="~ gap-1" items-center @click="openSigninDialog">
        <div i-ri:user-add-line />
        Add another account
      </button>
      <button
        v-if="currentUser" btn-text hover:text-red4 flex="~ gap-1" items-center
        @click="signout"
      >
        <div i-ri:logout-box-line />
        Sign out @{{ currentUser.account!.acct }}
      </button>
    </div>
  </div>
</template>
