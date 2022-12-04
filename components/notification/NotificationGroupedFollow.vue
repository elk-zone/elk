<script setup lang="ts">
import type { GroupedNotifications } from '~/types'

const { items } = defineProps<{
  items: GroupedNotifications
}>()

const { formatHumanReadableNumber, forSR } = useHumanReadableNumber()

const count = $computed(() => items.items.length)
const addSR = $computed(() => forSR(count))
const isExpanded = ref(false)
</script>

<template>
  <article flex flex-col relative>
    <div flex items-center absolute class="-top-3.5" left-2 bg-base px-2>
      <div i-ri:user-follow-fill mr-3 color-primary aria-hidden="true" />
      <template v-if="addSR">
        <span
          aria-hidden="true"
        >
          {{ $t('notification.followed_you_count', count, { named: { followers: formatHumanReadableNumber(count) } }) }}
        </span>
        <span sr-only>
          {{ $t('notification.followed_you_count', count, { named: { followers: count } }) }}
        </span>
      </template>
      <span v-else>
        {{ $t('notification.followed_you_count', count, { named: { followers: count } }) }}
      </span>
    </div>
    <div pt-1 pb-2>
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
          <NuxtLink :to="getAccountRoute(item.account)">
            <AccountAvatar :account="item.account" w-12 h-12 />
          </NuxtLink>
        </AccountHoverWrapper>
      </div>
    </div>
  </article>
</template>
