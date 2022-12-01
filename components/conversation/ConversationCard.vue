<script setup lang="ts">
import type { Conversation } from 'masto'

const props = defineProps<{
  conversation: Conversation
}>()
</script>

<template>
  <article flex flex-col gap-2>
    <div flex gap-2 flex-wrap text-sm px-2>
      {{ $t('conversation.with') }}
      <AccountInlineInfo v-for="account in conversation.accounts" :key="account.id" :account="account" />
    </div>
    <StatusCard v-if="conversation.lastStatus" :status="conversation.lastStatus" :actions="false" />
  </article>
</template>
