<script setup lang="ts">
import type { UserLogin } from '~/types'

const all = useUsers()

const router = useRouter()
const masto = useMasto()
const switchUser = (user: UserLogin) => {
  if (!user.guest && !currentUser.value?.guest && user.account.id === currentUser.value?.account.id)
    router.push(getAccountRoute(user.account))
  else
    masto.loginTo(user)
}
</script>

<template>
  <div flex justify-start items-end px-2 gap-5>
    <div flex="~ wrap-reverse" gap-5>
      <template v-for="user of all" :key="user.id">
        <button
          flex rounded
          cursor-pointer
          aria-label="Switch user"
          :class="user.account?.id === currentUser?.account?.id ? '' : 'op25 grayscale'"
          hover="filter-none op100"
          @click="switchUser(user)"
        >
          <AccountAvatar w-13 h-13 :account="user.account" />
        </button>
      </template>
    </div>
    <div flex items-center justify-center w-13 h-13>
      <UserDropdown />
    </div>
  </div>
</template>
