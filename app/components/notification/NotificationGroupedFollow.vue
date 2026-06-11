<script setup lang="ts">
import type { GroupedNotifications } from '#shared/types'

const { items } = defineProps<{
  items: GroupedNotifications
}>()

const maxVisibleFollows = 5
const follows = computed(() => items.items)
const visibleFollows = computed(() => follows.value.slice(0, maxVisibleFollows))
const count = computed(() => follows.value.length)
const countPlus = computed(() => Math.max(count.value - maxVisibleFollows, 0))
const isExpanded = ref(false)
const lang = computed(() => {
  return (count.value > 1 || count.value === 0) ? undefined : items.items[0].status?.language
})

const timeAgoOptions = useTimeAgoOptions(true)
const timeAgoCreatedAt = computed(() => follows.value[0].createdAt)
const timeAgo = useTimeAgo(() => timeAgoCreatedAt.value, timeAgoOptions)
</script>

<template>
  <article flex flex-col relative :lang="lang ?? undefined">
    <NuxtLink
      v-if="count === 1"
      :to="getAccountRoute(follows[0].account)"
      flex items-center gap-3 px-3 py-3
    >
      <AccountBigAvatar :account="follows[0].account" />
      <div flex-1 min-w-0 flex items-baseline gap-1 flex-wrap>
        <AccountDisplayName
          :account="follows[0].account"
          text-primary font-bold line-clamp-1 ws-pre-wrap break-all hover:underline
        />
        <span ws-nowrap>
          {{ $t('notification.followed_you') }}
          <time text-secondary :datetime="timeAgoCreatedAt">
            ・{{ timeAgo }}
          </time>
        </span>
      </div>
    </NuxtLink>
    <div v-else flex items-center pt-3 px-3>
      <AccountHoverWrapper
        :account="follows[0].account"
      >
        <NuxtLink :to="getAccountRoute(follows[0].account)">
          <AccountDisplayName
            :account="follows[0].account"
            text-primary font-bold line-clamp-1 ws-pre-wrap break-all hover:underline
          />
        </NuxtLink>
      </AccountHoverWrapper>
      &nbsp;{{ $t('notification.and') }}&nbsp;
      <CommonLocalizedNumber
        keypath="notification.others"
        :count="count - 1"
        text-primary font-bold line-clamp-1 ws-pre-wrap break-all
      />
      &nbsp;{{ $t('notification.followed_you') }}
      <time text-secondary :datetime="timeAgoCreatedAt">
        ・{{ timeAgo }}
      </time>
    </div>
    <div v-if="count > 1" pb-3 px-3>
      <div
        v-if="!isExpanded"
        flex="~ wrap gap-1.75" pt-3 items-center cursor-pointer
        @click="isExpanded = !isExpanded"
      >
        <AccountHoverWrapper
          v-for="follow in visibleFollows"
          :key="follow.id"
          :account="follow.account"
        >
          <NuxtLink :to="getAccountRoute(follow.account)">
            <AccountAvatar :account="follow.account" w-12 h-12 />
          </NuxtLink>
        </AccountHoverWrapper>
        <div flex="~ 1" items-center>
          <span v-if="countPlus > 0" ps-2 text="base lg">+{{ countPlus }}</span>
          <div i-ri:arrow-down-s-line mx-1 text-secondary text-xl aria-hidden="true" />
        </div>
      </div>
      <div v-else>
        <div flex pt-3 pb-2 cursor-pointer @click="isExpanded = !isExpanded">
          <div i-ri:arrow-up-s-line text-secondary text-xl aria-hidden="true" />
          <span ps-2 text-base>Hide</span>
        </div>
        <AccountHoverWrapper
          v-for="follow in follows"
          :key="follow.id"
          :account="follow.account"
        >
          <NuxtLink :to="getAccountRoute(follow.account)" flex gap-3 py-2>
            <AccountAvatar :account="follow.account" w-12 h-12 />
            <StatusAccountDetails :account="follow.account" />
          </NuxtLink>
        </AccountHoverWrapper>
      </div>
    </div>
  </article>
</template>
