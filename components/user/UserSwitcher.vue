<script setup lang="ts">
const emit = defineEmits<{
  (event: 'click'): void
}>()

const all = useUsers()

const sorted = computed(() => {
  return all.value.sort((a, b) => isSameUser(a, currentUser.value) ? -1 : isSameUser(b, currentUser.value) ? 1 : 0)
})

const masto = useMasto()
</script>

<template>
  <div sm:min-w-80 max-w-100vw mxa py2 flex="~ col" @click="emit('click')">
    <template v-for="user of sorted" :key="user.id">
      <button
        flex rounded px4 py3 text-left
        hover:bg-active cursor-pointer transition-100
        aria-label="Switch user"
        @click="switchUser(user, masto)"
      >
        <AccountInfo v-if="checkAuth(user)" :account="user.account" :hover-card="false" square />
        <AccountGuest v-else :user="user" />
        <div flex-auto />
        <div v-if="isSameUser(user, currentUser)" i-ri:check-line text-primary mya text-2xl />
      </button>
    </template>
    <div border="t base" pt2>
      <CommonDropdownItem
        :text="$t('user.add_existing')"
        icon="i-ri:user-add-line"
        @click="openSigninDialog"
      />
      <CommonDropdownItem
        v-if="isMastoInitialised && canSignOut"
        :text="$t('user.sign_out_account', [getFullHandle(currentUser)])"
        icon="i-ri:logout-box-line rtl-flip"
        @click="signout"
      />
    </div>
  </div>
</template>
