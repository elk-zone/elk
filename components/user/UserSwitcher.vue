<script setup lang="ts">
import type { UserLogin } from '~/types'

const all = useUsers()

const sorted = computed(() => {
  return [
    currentUser.value!,
    ...all.value.filter(account => account.token !== currentUser.value?.token),
  ].filter(Boolean)
})

const router = useRouter()
const switchUser = (user: UserLogin) => {
  if (user.account.id === currentUser.value?.account.id)
    router.push(getAccountPath(user.account))
  else loginTo(user)
}
</script>

<template>
  <div min-w-80 mxa py2 flex="~ col">
    <template v-for="user of sorted" :key="user.id">
      <button
        flex rounded px4 py3 text-left
        hover:bg-active cursor-pointer transition-100
        aria-label="Switch user"
        @click="switchUser(user)"
      >
        <AccountInfo :account="user.account" />
        <div flex-auto />
        <div v-if="user.token === currentUser?.token" i-ri:check-line text-primary mya text-2xl />
      </button>
    </template>
    <div border="t base" pt2>
      <CommonDropdownItem
        :text=" $t('user.add_existing')"
        icon="i-ri:user-add-line"
        @click="openSigninDialog"
      />
      <CommonDropdownItem
        v-if="currentUser"
        :text="$t('user.sign_out_account', [getFullHandle(currentUser.account)])"
        icon="i-ri:logout-box-line"
        @click="signout"
      />
    </div>
  </div>
</template>
