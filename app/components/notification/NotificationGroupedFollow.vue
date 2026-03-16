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
    <div flex items-center top-0 left-2 pt-2 px-3>
      <div :class="count > 1 ? 'i-ri-group-line' : 'i-ri-user-3-line'" me-3 color-blue text-xl aria-hidden="true" />
      <template v-if="count > 1">
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
      </template>
      <template v-else-if="count === 1">
        <NuxtLink :to="getAccountRoute(follows[0].account)">
          <AccountDisplayName
            :account="follows[0].account"
            text-primary me-1 font-bold line-clamp-1 ws-pre-wrap break-all hover:underline
          />
        </NuxtLink>
        <span me-1 ws-nowrap>
          {{ $t('notification.followed_you') }}
          <time text-secondary :datetime="timeAgoCreatedAt">
            ・{{ timeAgo }}
          </time>
        </span>
      </template>
    </div>
    <div pb-2 ps8>
      <div
        v-if="!isExpanded && count > 1"
        flex="~ wrap gap-1.75" p4 items-center cursor-pointer
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
        <div v-if="count > 1" flex p-4 pb-2 cursor-pointer @click="isExpanded = !isExpanded">
          <div i-ri:arrow-up-s-line ms-2 text-secondary text-xl aria-hidden="true" />
          <span ps-2 text-base>Hide</span>
        </div>
        <AccountHoverWrapper
          v-for="follow in follows"
          :key="follow.id"
          :account="follow.account"
        >
          <NuxtLink :to="getAccountRoute(follow.account)" flex gap-4 px-4 py-2>
            <AccountAvatar :account="follow.account" w-12 h-12 />
            <StatusAccountDetails :account="follow.account" />
          </NuxtLink>
        </AccountHoverWrapper>
      </div>
    </div>
  </article>
</template>
