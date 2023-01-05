<script setup lang="ts">
// type used in <template>
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type { Account } from 'masto'

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
      <!-- type error of masto.js -->
      <NuxtLink :to="getAccountRoute(account.moved as unknown as Account)">
        <AccountInfo :account="account.moved as unknown as Account" />
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
