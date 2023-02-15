<script setup lang="ts">
// @ts-expect-error missing types
import { DynamicScrollerItem } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import type { Paginator, WsEvents, mastodon } from 'masto'
import StatusCard from '~~/components/status/StatusCard.vue'

const { paginator, stream, account, buffer = 10 } = defineProps<{
  paginator: Paginator<mastodon.v1.Status[], mastodon.v1.ListAccountStatusesParams>
  stream?: Promise<WsEvents>
  context?: mastodon.v2.FilterContext
  account?: mastodon.v1.Account
  preprocess?: (items: mastodon.v1.Status[]) => mastodon.v1.Status[]
  buffer?: number
}>()

const { formatNumber } = useHumanReadableNumber()
const virtualScroller = $(usePreferences('experimentalVirtualScroller'))

const showOriginSite = $computed(() =>
  account && account.id !== currentUser.value?.account.id && getServerName(account) !== currentServer.value,
)

let focussedStatusIndex = -1

onKeyStroke((event) => {
  if (event.key === 'k') {
    if (focussedStatusIndex - 1 < 0)
      return

    focussedStatusIndex--
  }

  if (event.key === 'j')
    focussedStatusIndex++

  if (event.key === 'j' || event.key === 'k') {
    const status = document.getElementById(`status-${focussedStatusIndex}`)
    status?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    status?.focus({ preventScroll: true })
  }
})
</script>

<template>
  <CommonPaginator v-bind="{ paginator, stream, preprocess, buffer }" :virtual-scroller="virtualScroller">
    <template #updater="{ number, update }">
      <button py-4 border="b base" flex="~ col" p-3 w-full text-primary font-bold @click="update">
        {{ $t('timeline.show_new_items', number, { named: { v: formatNumber(number) } }) }}
      </button>
    </template>
    <template #default="{ item, index, older, newer, active }">
      <template v-if="virtualScroller">
        <DynamicScrollerItem :item="item" :active="active" tag="article">
          <StatusCard :id="`status-${index}`" :status="item" :context="context" :older="older" :newer="newer" />
        </DynamicScrollerItem>
      </template>
      <template v-else>
        <StatusCard ref="cards" :status="item" :context="context" :older="older" :newer="newer" />
      </template>
    </template>
    <template v-if="context === 'account' && showOriginSite" #done>
      <div p5 text-secondary text-center flex flex-col items-center gap1>
        <span italic>{{ $t('timeline.view_older_posts') }}</span>
        <NuxtLink
          :href="account!.url" target="_blank" external
          flex="~ gap-1" items-center text-primary
          hover="underline text-primary-active"
        >
          <div i-ri:external-link-fill />
          {{ $t('menu.open_in_original_site') }}
        </NuxtLink>
      </div>
    </template>
  </CommonPaginator>
</template>
