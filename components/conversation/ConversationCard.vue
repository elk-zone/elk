<script setup lang="ts">
import type { Conversation } from 'masto'

const { conversation } = defineProps<{
  conversation: Conversation
}>()

const withAccounts = $computed(() =>
  conversation.accounts.filter(account => account.id !== conversation.lastStatus?.account.id),
)
</script>

<template>
  <article v-if="conversation.lastStatus" flex flex-col gap-2>
    <div v-if="withAccounts.length" absolute flex gap-2 text-sm text-secondary font-bold left-3 px2 pt2>
      <p mr-1>
        {{ $t('conversation.with') }}
      </p>
      <AccountAvatar v-for="account in withAccounts" :key="account.id" h-5 w-5 :account="account" />
    </div>
    <StatusCard v-if="conversation.lastStatus" :decorated="true" :status="conversation.lastStatus" :actions="false" />
  </article>
</template>
