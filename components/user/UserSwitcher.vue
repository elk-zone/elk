<script setup lang="ts">
const all = useUsers()

const sorted = computed(() => {
  return [
    currentUser.value!,
    ...all.value.filter(account => account.token !== currentUser.value?.token),
  ].filter(Boolean)
})
</script>

<template>
  <div max-w-40rem mxa p4 flex="~ col gap2">
    <h1 text-2xl>
      Account
    </h1>
    <div mx--2>
      <template v-for="user of sorted" :key="user.id">
        <AccountInfo
          :account="user.account"
          :link="false"
          :full-server="true"
          rounded p2
          :class="user.token !== currentUser?.token ? 'hover:bg-active cursor-pointer transition-100' : ''"
          @click="loginTo(user)"
        >
          <template v-if="user.token === currentUser?.token">
            <div flex-auto />
            <div i-ri:check-line text-primary mya text-2xl />
          </template>
        </AccountInfo>
      </template>
    </div>
    <div mx--4 border="t base" pt2>
      <button btn-text flex="~ gap-1" items-center @click="openSigninDialog">
        <div i-ri:user-add-line />
        Add an existing account
      </button>
      <button
        v-if="currentUser" btn-text hover:text-red4 flex="~ gap-1" items-center
        @click="signout"
      >
        <div i-ri:logout-box-line />
        Sign out {{ getAccountHandle(currentUser.account) }}
      </button>
    </div>
  </div>
</template>
