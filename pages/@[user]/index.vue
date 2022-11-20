<script setup lang="ts">
const props = defineProps<{
  modelValue?: boolean
}>()

const params = useRoute().params
const user = $computed(() => params.user as string)
const masto = await useMasto()
const { data: account } = await useAsyncData(`${user}:info`, () => masto.accounts.lookup({ acct: user }))

const tabNames = ['Posts', 'Posts and replies'] as const

// Don't use local storage because it is better to default to Posts every time you visit a user's profile.
const tab = $ref('Posts')

const paginator = $computed(() => {
  // bug in Masto.js, it should convert `excludeReplies` to `exclude_replies`
  // https://github.com/neet/masto.js/issues/689
  return masto.accounts.getStatusesIterable(account.value!.id!, { exclude_replies: tab === 'Posts' } as any)
})
</script>

<template>
  <div>
    <AccountHeader :account="account" />
  </div>
  <CommonTabs v-model="tab" :options="tabNames" />
  <TimelinePaginator :key="tab" :paginator="paginator" />
</template>
