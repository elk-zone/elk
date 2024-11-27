<script setup lang="ts">
import type { akkoma } from 'akko'

defineProps<{
  account: akkoma.v1.Account
  limit?: number
}>()
</script>

<template>
  <div
    flex="~ gap1" items-center
    class="border border-base rounded-md px-1"
    text-secondary-light
  >
    <slot name="prepend" />
    <div v-for="role in account.roles?.slice(0, limit)" :key="role.id" flex>
      <div :style="`color: ${role.color}; border-color: ${role.color}`">
        {{ role.name }}
      </div>
    </div>
  </div>
  <div
    v-if="limit && account.roles?.length > limit"
    flex="~ gap1" items-center
    class="border border-base rounded-md px-1"
    text-secondary-light
  >
    +{{ account.roles?.length - limit }}
  </div>
</template>
