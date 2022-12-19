<script setup lang="ts">
import type { UserLogin } from '~/types'

const all = useUsers()

const router = useRouter()
const switchUser = (user: UserLogin) => {
  if (user.account.id === currentUser.value?.account.id)
    router.push(getAccountRoute(user.account))
  else
    loginTo(user)
}
</script>

<template>
  <div flex="~ col" pb8 px4 gap-6 w-20 h-full justify-end>
    <template v-for="user of all" :key="user.id">
      <button
        flex rounded
        cursor-pointer
        aria-label="Switch user"
        :class="user.account.id === currentUser?.account.id ? '' : 'grayscale'"
        hover:filter-none
        @click="switchUser(user)"
      >
        <AccountAvatar w-12 h-12 :account="user.account" :hover-card="false" />
      </button>
    </template>
  </div>
</template>
