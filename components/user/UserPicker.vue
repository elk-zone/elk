<script setup lang="ts">
const all = useUsers()
const masto = useMasto()
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
          @click="switchUser(user, masto)"
        >
          <AccountAvatar v-if="checkAuth(user)" w-13 h-13 :account="user.account" square />
          <div v-else bg="gray/40" rounded-full w-13 h-13 flex shrink-0 items-center justify-center text-5>
            G
          </div>
        </button>
      </template>
    </div>
    <div flex items-center justify-center w-13 h-13>
      <UserDropdown />
    </div>
  </div>
</template>
