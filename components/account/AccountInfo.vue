<script setup lang="ts">
import type { Account } from 'masto'

defineProps<{
  account: Account
}>()
</script>

<template>
  <div flex gap-2>
    <div p1>
      <NuxtLink :to="`/@${account.acct}`">
        <img :src="account.avatar" rounded w-10 h-10 bg-gray:10>
      </NuxtLink>
    </div>
    <NuxtLink flex flex-col :to="`/@${account.acct}`">
      <CommonRichContent font-bold :content="account.displayName" />
      <p op35 text-sm>
        @{{ account.acct }}
      </p>
    </NuxtLink>
    <slot />
  </div>
</template>
