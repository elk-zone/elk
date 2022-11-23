<script setup lang="ts">
const props = defineProps<{
  modelValue?: boolean
}>()

const params = useRoute().params
const user = $computed(() => params.user as string)

const { data: account } = await useAsyncData(`${user}:info`, () => masto.accounts.lookup({ acct: user }))

const tabNames = ['Posts', 'Posts and replies'] as const

// Don't use local storage because it is better to default to Posts every time you visit a user's profile.
const tab = $ref('Posts')

const paginator = $computed(() => {
  return masto.accounts.getStatusesIterable(account.value!.id!, { excludeReplies: tab === 'Posts' } as any)
})
</script>

<template>
  <template v-if="account">
    <div>
      <AccountHeader :account="account" />
    </div>
    <CommonTabs v-model="tab" :options="tabNames" />
    <TimelinePaginator :key="tab" :paginator="paginator" />
  </template>

  <CommonNotFound v-else>
    Account @{{ params.user }} not found
  </CommonNotFound>
</template>
