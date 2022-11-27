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
  <div min-w-80 mxa py2 flex="~ col">
    <template v-for="user of sorted" :key="user.id">
      <Component
        :is="user.token !== currentUser?.token ? 'button' : 'div'"
        flex rounded px4 py3 text-left
        :class="user.token !== currentUser?.token ? 'hover:bg-active cursor-pointer transition-100' : ''"
        @click="loginTo(user)"
      >
        <AccountInfo :account="user.account" />
        <div flex-auto />
        <div v-if="user.token === currentUser?.token" i-ri:check-line text-primary mya text-2xl />
      </Component>
    </template>
    <div border="t base" pt2>
      <button btn-text flex="~ gap-1" items-center @click="openSigninDialog">
        <div i-ri:user-add-line />
        Add an existing account
      </button>
      <button
        v-if="currentUser" btn-text hover:text-red4 flex="~ gap-1" items-center
        @click="signout"
      >
        <div i-ri:logout-box-line />
        Sign out {{ getFullHandle(currentUser.account) }}
      </button>
    </div>
  </div>
</template>
