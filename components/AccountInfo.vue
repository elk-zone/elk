<script setup lang="ts">
import type { Account } from '~/api-client/types'

const props = defineProps<{
  account: Account
}>()
</script>

<template>
  <div flex gap-2>
    <div p1>
      <img :src="account.avatar" rounded w-10 h-10>
    </div>
    <div flex flex-col>
      <h4 font-bold>
        {{ account.display_name }}
      </h4>
      <p op50>
        @{{ account.acct }}
      </p>
    </div>
  </div>
</template>
