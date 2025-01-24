<script setup lang="ts">
import type { GroupedNotifications } from '~/types'

const { items } = defineProps<{
  items: GroupedNotifications
}>()

// DEBUG from
const n = 7
const follow = items.items[0]
// eslint-disable-next-line vue/no-mutating-props
items.items = Array.from({ length: n }).fill(0).map(_ => follow)
// DEBUG end

const visibleFollows = computed(() => items.items.slice(0, 5))
const count = computed(() => items.items.length)
const countPlus = computed(() => Math.max(items.items.length - 5 - 1, 0))
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
        <AccountHoverWrapper
          :account="visibleFollows[0].account"
        >
          <NuxtLink :to="getAccountRoute(visibleFollows[0].account)">
            <AccountDisplayName :account="items.items[0].account" font-bold hover:underline />
          </NuxtLink>
        </AccountHoverWrapper>
        &nbsp;{{ $t('notification.and') }}&nbsp;
        <CommonLocalizedNumber
          keypath="notification.others"
          :count="count - 1"
          font-bold
        />
        &nbsp;{{ $t('notification.followed_you') }}
      </template>
      <template v-else-if="count === 1">
        <NuxtLink :to="getAccountRoute(items.items[0].account)">
          <AccountDisplayName
            :account="visibleFollows[0].account"
            text-primary me-1 font-bold line-clamp-1 ws-pre-wrap break-all
          />
        </NuxtLink>
        <span me-1 ws-nowrap>
          {{ $t('notification.followed_you') }}
        </span>
      </template>
    </div>
    <div pb-2 ps8>
      <div
        v-if="!isExpanded"
        flex="~ wrap gap-1.75" p4 items-center cursor-pointer
        @click="isExpanded = !isExpanded"
      >
        <AccountHoverWrapper
          v-for="item in visibleFollows"
          :key="item.id"
          :account="item.account"
        >
          <NuxtLink :to="getAccountRoute(item.account)">
            <AccountAvatar :account="item.account" w-12 h-12 />
          </NuxtLink>
        </AccountHoverWrapper>
        <div flex="~ 1">
          <span v-if="countPlus > 0" ps-2 text="base lg">+{{ countPlus }}</span>
          <div i-ri:arrow-down-s-line mx-1 text-secondary text-xl aria-hidden="true" />
        </div>
      </div>
      <div v-else>
        <div flex p-4 pb-2 cursor-pointer @click="isExpanded = !isExpanded">
          <div i-ri:arrow-up-s-line ms-2 text-secondary text-xl aria-hidden="true" />
          <span ps-2 text-base>Hide</span>
        </div>
        <AccountInfo
          v-for="item in items.items"
          :key="item.id"
          :account="item.account"
          p3
        />
      </div>
    </div>
  </article>
</template>
