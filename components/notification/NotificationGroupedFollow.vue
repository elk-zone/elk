<script setup lang="ts">
import type { GroupedNotifications } from '~/types'

const { items } = defineProps<{
  items: GroupedNotifications
}>()

const count = computed(() => items.items.length)
const isExpanded = ref(false)
</script>

<template>
  <article flex flex-col>
    <div flex ml-4 items-center>
      <div i-ri:user-follow-fill mr-3 color-primary />
      {{ $t('notification.followed_you_count', [`${count}`]) }}
    </div>
    <div v-if="isExpanded">
      <AccountCard
        v-for="item in items.items"
        :key="item.id"
        :account="item.account"
        p3
      />
    </div>
    <div v-else flex="~ wrap gap-1" p4>
      <AccountHoverWrapper
        v-for="item in items.items"
        :key="item.id"
        :account="item.account"
      >
        <NuxtLink :to="getAccountPath(item.account)">
          <AccountAvatar :account="item.account" w-8 h-8 />
        </NuxtLink>
      </AccountHoverWrapper>
    </div>
  </article>
</template>
