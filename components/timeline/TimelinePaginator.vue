<script setup lang="ts">
// @ts-expect-error missing types
import { DynamicScrollerItem } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import type { Account, FilterContext, Paginator, Status, WsEvents } from 'masto'

const { paginator, stream, account } = defineProps<{
  paginator: Paginator<any, Status[]>
  stream?: Promise<WsEvents>
  context?: FilterContext
  account?: Account
  preprocess?: (items: any[]) => any[]
}>()

const { formatNumber } = useHumanReadableNumber()
const virtualScroller = $(useFeatureFlag('experimentalVirtualScroll'))

const showOriginSite = $computed(() =>
  account && account.id !== currentUser.value?.account?.id && getServerName(account) !== currentServer.value,
)
</script>

<template>
  <CommonPaginator v-bind="{ paginator, stream, preprocess }" :virtual-scroller="virtualScroller">
    <template #updater="{ number, update }">
      <button py-4 border="b base" flex="~ col" p-3 w-full text-primary font-bold @click="update">
        {{ $t('timeline.show_new_items', number, { named: { v: formatNumber(number) } }) }}
      </button>
    </template>
    <template #default="{ item, older, newer, active }">
      <template v-if="virtualScroller">
        <DynamicScrollerItem :item="item" :active="active" tag="article">
          <StatusCard :status="item" :context="context" :older="older" :newer="newer" />
        </DynamicScrollerItem>
      </template>
      <template v-else>
        <StatusCard :status="item" :context="context" :older="older" :newer="newer" />
      </template>
    </template>
    <template v-if="context === 'account' && showOriginSite" #done>
      <div p5 text-secondary text-center flex flex-col items-center gap1>
        <span italic>{{ $t('timeline.view_older_posts') }}</span>
        <a
          :href="account!.url" target="_blank"
          flex="~ gap-1" items-center text-primary
          hover="underline text-primary-active"
        >
          <div i-ri:external-link-fill />
          {{ $t('menu.open_in_original_site') }}
        </a>
      </div>
    </template>
  </CommonPaginator>
</template>
