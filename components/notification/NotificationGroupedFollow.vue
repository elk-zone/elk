<script setup lang="ts">
import type { GroupedNotifications } from '~/types'

const { items } = defineProps<{
  items: GroupedNotifications
}>()

const count = computed(() => items.items.length)
const isExpanded = ref(false)
const lang = computed(() => {
  return (count.value > 1 || count.value === 0) ? undefined : items.items[0].status?.language
})
</script>

<template>
  <article flex flex-col relative :lang="lang ?? undefined">
    <div flex items-center top-0 left-2 pt-2 px-3>
      <div :class="count > 1 ? 'i-ri-group-line' : 'i-ri-user-3-line'" me-3 color-blue text-xl aria-hidden="true" />
      <template v-if="count > 1">
        <CommonLocalizedNumber
          keypath="notification.followed_you_count"
          :count="count"
        />
      </template>
      <template v-else-if="count === 1">
        <NuxtLink :to="getAccountRoute(items.items[0].account)">
          <AccountDisplayName
            :account="items.items[0].account"
            text-primary me-1 font-bold line-clamp-1 ws-pre-wrap break-all
          />
        </NuxtLink>
        <span me-1 ws-nowrap>
          {{ $t('notification.followed_you') }}
        </span>
      </template>
    </div>
    <div pb-2 ps8>
      <div v-if="isExpanded">
        <AccountCard
          v-for="item in items.items"
          :key="item.id"
          :account="item.account"
          p3
        />
      </div>
      <div v-else flex="~ wrap gap-1.75" p4>
        <AccountHoverWrapper
          v-for="item in items.items"
          :key="item.id"
          :account="item.account"
        >
          <NuxtLink :to="getAccountRoute(item.account)">
            <AccountAvatar :account="item.account" w-12 h-12 />
          </NuxtLink>
        </AccountHoverWrapper>
      </div>
    </div>
  </article>
</template>
