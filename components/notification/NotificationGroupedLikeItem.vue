<script lang="ts" setup>
import type { GroupedAccountLike } from '~/types'

const { likes } = defineProps<{
  likes: GroupedAccountLike[]
  hint: string
}>()
</script>

<template>
  <div v-if="likes.length" flex="~ gap-1">
    <slot name="icon" />
    <div flex="~ col">
      <div flex="~ wrap gap-1">
        <template v-for="i, idx of likes" :key="idx">
          <div flex-shrink-0>
            <AccountHoverWrapper class="flex-shrink-0" :account="i.account">
              <NuxtLink :to="getAccountRoute(i.account)">
                <AccountAvatar text-primary font-bold :account="i.account" class="h-1.5em w-1.5em" />
              </NuxtLink>
            </AccountHoverWrapper>
          </div>
        </template>
      </div>
      <div mt2>
        {{ hint }}
      </div>
    </div>
  </div>
</template>
