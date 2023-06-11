<script setup lang="ts">
import type { mastodon } from 'masto'

defineProps<{
  account: mastodon.v1.Account
}>()
</script>

<template>
  <div flex="~ col gap-2" p4>
    <div flex="~ gap-1" justify-center>
      <AccountInlineInfo :account="account" :link="false" />
      {{ $t('account.moved_title') }}
    </div>

    <div flex>
      <template v-if="currentUser">
        <NuxtLink :to="getAccountRoute(account.moved!)">
          <AccountInfo :account="account.moved!" />
        </NuxtLink>
        <div flex-auto />
        <div flex items-center>
          <NuxtLink :to="getAccountRoute(account.moved as any)" btn-solid inline-block h-fit>
            {{ $t('account.go_to_profile') }}
          </NuxtLink>
        </div>
      </template>
      <template v-else>
        <NuxtLink :to="undefined" @click.prevent="checkLogin()">
          <AccountInfo :account="account.moved!" />
        </NuxtLink>
        <div flex-auto />
        <div flex items-center>
          <NuxtLink :to="undefined" btn-solid inline-block h-fit @click.prevent="checkLogin()">
            {{ $t('account.go_to_profile') }}
          </NuxtLink>
        </div>
      </template>
    </div>
  </div>
</template>
