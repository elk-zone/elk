<script setup lang="ts">
import type { Account } from 'masto/fetch'

defineProps<{
  account: Account
}>()
</script>

<template>
  <div flex="~ col gap-2" p4>
    <div flex="~ gap-1" justify-center>
      <AccountInlineInfo :account="account" :link="false" />
      {{ $t('account.moved_title') }}
    </div>

    <div flex>
      <NuxtLink :to="getAccountRoute(account.moved as any)">
        <AccountInfo :account="account.moved" />
      </NuxtLink>
      <div flex-auto />
      <div flex items-center>
        <NuxtLink :to="getAccountRoute(account.moved as any)">
          <button btn-solid h-fit>
            {{ $t('account.go_to_profile') }}
          </button>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
