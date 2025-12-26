<script setup lang="ts">
import type { mastodon } from 'masto'
// @ts-expect-error missing types
import { DynamicScrollerItem } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

const { account, buffer = 10, endMessage = true } = defineProps<{
  paginator: mastodon.Paginator<mastodon.v1.ScheduledStatus[], mastodon.DefaultPaginationParams>
  stream?: mastodon.streaming.Subscription
  context?: mastodon.v2.FilterContext
  account?: mastodon.v1.Account
  preprocess?: (items: (mastodon.v1.ScheduledStatus | mastodon.v1.Status)[]) => mastodon.v1.Status[]
  buffer?: number
  endMessage?: boolean | string
}>()

const { formatNumber } = useHumanReadableNumber()
const virtualScroller = usePreferences('experimentalVirtualScroller')

const showOriginSite = computed(() =>
  account && account.id !== currentUser.value?.account.id && getServerName(account) !== currentServer.value,
)
</script>

<template>
  <CommonPaginator v-bind="{ paginator, stream, preprocess, buffer, endMessage }" :virtual-scroller="virtualScroller">
    <template #updater="{ number, update }">
      <button id="elk_show_new_items" py-4 border="b base" flex="~ col" p-3 w-full text-primary font-bold @click="update">
        {{ $t('timeline.show_new_items', number, { named: { v: formatNumber(number) } }) }}
      </button>
    </template>
    <template #default="{ item, older, newer, active }">
      <component
        :is="virtualScroller ? DynamicScrollerItem : 'article'"
        :item="item"
        :active="active"
      >
        <StatusCard
          :status="item" :context="context" :older="older" :newer="newer" :account="account"
          :actions="false" :disable-link="true"
        />
      </component>
    </template>
    <template v-if="context === 'account' " #done="{ items }">
      <div
        v-if="showOriginSite || items.length === 0"
        p5 text-secondary text-center flex flex-col items-center gap1
      >
        <template v-if="showOriginSite">
          <span italic>{{ $t('timeline.view_older_posts') }}</span>
          <NuxtLink
            :href="account!.url" target="_blank" external
            flex="~ gap-1" items-center text-primary
            hover="underline text-primary-active"
          >
            <div i-ri:external-link-fill />
            {{ $t('menu.open_in_original_site') }}
          </NuxtLink>
        </template>
        <span v-else-if="items.length === 0">{{ $t('timeline.no_posts') }}</span>
      </div>
    </template>
  </CommonPaginator>
</template>
