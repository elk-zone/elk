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
          <AccountAvatar v-if="!user.guest" w-13 h-13 :account="user.account" />
          <span v-else>TODO: Guest from {{ user.server }}</span>
        </button>
      </template>
    </div>
    <div flex items-center justify-center w-13 h-13>
      <UserDropdown />
    </div>
  </div>
</template>
