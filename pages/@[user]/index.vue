<script setup lang="ts">
const props = defineProps<{
  modelValue?: boolean
}>()

const params = useRoute().params
const user = $computed(() => params.user as string)
const masto = await useMasto()
const { data: account } = await useAsyncData(`${user}:info`, () => masto.accounts.lookup({ acct: user }))

const tabNames = ['posts', 'posts-and-replies'] as const

// Don't use local storage because it is better to default to Posts every time you visit a user's profile.
const tab = $ref('posts')

const paginator = $computed(() => {
  return masto.accounts.getStatusesIterable(account.value!.id!, { excludeReplies: tab === 'posts' })
})
</script>

<template>
  <div>
    <AccountHeader :account="account" />
  </div>
  <CommonTabs v-model="tab" :options="tabNames" />
  <TimelinePaginator :key="tab" :paginator="paginator" />
</template>
